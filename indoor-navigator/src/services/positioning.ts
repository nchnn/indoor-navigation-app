import { EDGES, FLOOR_H, FLOOR_W, METERS_PER_UNIT, NODES, nodeById } from '../data/old.dorm3F';

export interface PlanPos {
  x: number;
  y: number;
}

export interface GpsOffset {
  dLat: number;
  dLng: number;
}

/**
 * LIVE POSITIONING — GPS + dead reckoning, Expo Go compatible.
 *
 * Honest constraints (surfaced in UI, not hidden):
 * - Phone GPS is ~5–30 m accurate and degrades INDOORS (concrete kills it).
 *   It is good for building-level anchor/geofence, not room-level fixes.
 * - Room-level live tracking here = pedometer + compass dead reckoning
 *   from a known anchor ("I'm here"), snapped to the hallway graph.
 * - The provider interface below is where BLE-beacon / Wi-Fi RTT / UWB
 *   providers plug in later without touching UI.
 */

// ── Mock survey anchor: West Corner ↔ this GPS fix ─────────────────
// Replace with a real surveyed fix for your dorm. On-device you can also
// stand at any checkpoint and hit "Calibrate GPS here" — no code change.
export const GPS_ANCHOR_NODE_ID = 'c-west';
export const GPS_ANCHOR_LATLNG = { latitude: 14.599512, longitude: 120.984222 };

export const STEP_LENGTH_M = 0.7;
export const GPS_GOOD_ACC_M = 12;

const M_PER_DEG_LAT = 111320;
const mPerDegLng = (lat: number) => M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function gpsToPlan(lat: number, lng: number, offset: GpsOffset = { dLat: 0, dLng: 0 }): PlanPos {
  const anchor = nodeById(GPS_ANCHOR_NODE_ID);
  const ax = anchor?.x ?? 90;
  const ay = anchor?.y ?? 310;
  const northM = (lat + offset.dLat - GPS_ANCHOR_LATLNG.latitude) * M_PER_DEG_LAT;
  const eastM = (lng + offset.dLng - GPS_ANCHOR_LATLNG.longitude) * mPerDegLng(GPS_ANCHOR_LATLNG.latitude);
  return {
    // plan +x = east, +y = south (SVG y-down)
    x: clamp(ax + eastM / METERS_PER_UNIT, 0, FLOOR_W),
    y: clamp(ay - northM / METERS_PER_UNIT, 0, FLOOR_H),
  };
}

/** Offset that would map the current GPS reading exactly onto a checkpoint. */
export function calibrationOffsetFor(lat: number, lng: number, nodeId: string): GpsOffset {
  const node = nodeById(nodeId);
  const anchor = nodeById(GPS_ANCHOR_NODE_ID);
  if (!node || !anchor) return { dLat: 0, dLng: 0 };
  const wantEastM = (node.x - anchor.x) * METERS_PER_UNIT;
  const wantNorthM = (anchor.y - node.y) * METERS_PER_UNIT;
  const wantLat = GPS_ANCHOR_LATLNG.latitude + wantNorthM / M_PER_DEG_LAT;
  const wantLng = GPS_ANCHOR_LATLNG.longitude + wantEastM / mPerDegLng(GPS_ANCHOR_LATLNG.latitude);
  return { dLat: wantLat - lat, dLng: wantLng - lng };
}

export function haversineM(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const dLa = ((bLat - aLat) * Math.PI) / 180;
  const dLn = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLa / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** One dead-reckoning step: heading 0°=North, 90°=East. Returns plan-unit delta. */
export function stepDelta(headingDeg: number, stepM = STEP_LENGTH_M): PlanPos {
  const rad = (headingDeg * Math.PI) / 180;
  const eastM = Math.sin(rad) * stepM;
  const northM = Math.cos(rad) * stepM;
  return { x: eastM / METERS_PER_UNIT, y: -northM / METERS_PER_UNIT };
}

/** Bearing 0°=N/90°=E between two plan points (for fallback heading). */
export function bearingBetween(a: PlanPos, b: PlanPos): number {
  const east = b.x - a.x;
  const north = -(b.y - a.y);
  return ((Math.atan2(east, north) * 180) / Math.PI + 360) % 360;
}

const byId = new Map((NODES ?? []).map((n) => [n.id, n]));

/** Snap a raw position onto the nearest walkable hallway edge. */
export function snapToGraph(p: PlanPos): { pos: PlanPos; distM: number } {
  let best: PlanPos = { ...p };
  let bestD = Infinity;
  for (const e of EDGES) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const len2 = vx * vx + vy * vy;
    const t = len2 === 0 ? 0 : clamp(((p.x - a.x) * vx + (p.y - a.y) * vy) / len2, 0, 1);
    const q = { x: a.x + vx * t, y: a.y + vy * t };
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < bestD) {
      bestD = d;
      best = q;
    }
  }
  return { pos: best, distM: bestD * METERS_PER_UNIT };
}

/** Nearest route-polyline segment index for a live position (drives turn-by-turn highlight). */
export function nearestRouteSeg(routeIds: string[], p: PlanPos): number {
  const pts = (routeIds ?? []).map((id) => byId.get(id)).filter((n) => n !== undefined);
  if (pts.length < 2) return 0;
  let bestI = 0;
  let bestD = Infinity;
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const len2 = vx * vx + vy * vy;
    const t = len2 === 0 ? 0 : clamp(((p.x - a.x) * vx + (p.y - a.y) * vy) / len2, 0, 1);
    const d = Math.hypot(p.x - (a.x + vx * t), p.y - (a.y + vy * t));
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  return bestI;
}
