import { EDGES, METERS_PER_UNIT, NODES, type FloorNode } from '../data/old.dorm3F';

const nodeMap = new Map<string, FloorNode>((NODES ?? []).map((n) => [n.id, n]));

export function getNode(id: string): FloorNode | undefined {
  return nodeMap.get(id);
}

function dist(a: FloorNode, b: FloorNode): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy) * METERS_PER_UNIT;
}

type Adj = Map<string, { to: string; w: number }[]>;

let adjCache: Adj | null = null;
function adjacency(): Adj {
  if (adjCache) return adjCache;
  const adj: Adj = new Map();
  const add = (f: string, t: string) => {
    const a = nodeMap.get(f);
    const b = nodeMap.get(t);
    if (!a || !b) return;
    const w = dist(a, b);
    if (!adj.has(f)) adj.set(f, []);
    if (!adj.has(t)) adj.set(t, []);
    adj.get(f)!.push({ to: t, w });
    adj.get(t)!.push({ to: f, w });
  };
  for (const e of EDGES) add(e.from, e.to);
  adjCache = adj;
  return adj;
}

/** Dijkstra shortest path (hallway graph). Returns node ids incl. start+end. */
export function findShortestPath(fromId: string, toId: string): string[] {
  if (fromId === toId) return [fromId];
  const adj = adjacency();
  if (!adj.has(fromId) || !adj.has(toId)) return [];
  const d = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();
  for (const n of NODES) {
    d.set(n.id, Infinity);
    prev.set(n.id, null);
  }
  d.set(fromId, 0);

  for (;;) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, v] of d) {
      if (!visited.has(id) && v < best) {
        best = v;
        u = id;
      }
    }
    if (u === null || best === Infinity) break;
    if (u === toId) break;
    visited.add(u);
    for (const { to, w } of adj.get(u) ?? []) {
      const alt = (d.get(u) ?? Infinity) + w;
      if (alt < (d.get(to) ?? Infinity)) {
        d.set(to, alt);
        prev.set(to, u);
      }
    }
  }

  if ((d.get(toId) ?? Infinity) === Infinity) return [];
  const path: string[] = [];
  let cur: string | null = toId;
  while (cur) {
    path.unshift(cur);
    if (cur === fromId) break;
    cur = prev.get(cur) ?? null;
  }
  return path[0] === fromId ? path : [];
}

export function pathDistanceM(path: string[]): number {
  let total = 0;
  for (let i = 0; i + 1 < path.length; i++) {
    const a = nodeMap.get(path[i]);
    const b = nodeMap.get(path[i + 1]);
    if (a && b) total += dist(a, b);
  }
  return total;
}

export function etaSeconds(distanceM: number): number {
  const speed = 1.2; // m/s indoor walk
  return distanceM / speed;
}

export interface RouteStep {
  key: string;
  icon: 'start' | 'straight' | 'left' | 'right' | 'arrive';
  text: string;
  sub: string;
}

function turnKind(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): 'straight' | 'left' | 'right' {
  const v1x = bx - ax;
  const v1y = by - ay;
  const v2x = cx - bx;
  const v2y = cy - by;
  const cross = v1x * v2y - v1y * v2x;
  const dot = v1x * v2x + v1y * v2y;
  const ang = Math.atan2(Math.abs(cross), dot) * (180 / Math.PI);
  if (ang < 28) return 'straight';
  return cross > 0 ? 'right' : 'left'; // SVG y-down: cross>0 = right turn
}

export function pathToSteps(path: string[]): RouteStep[] {
  if (path.length === 0) return [];
  const pts = path
    .map((id) => nodeMap.get(id))
    .filter((n): n is FloorNode => !!n);
  if (pts.length === 1) {
    return [{ key: 'only', icon: 'arrive', text: `You are at ${pts[0].name}`, sub: 'No walking needed' }];
  }
  const steps: RouteStep[] = [];
  const firstSegM = dist(pts[0], pts[1]);
  steps.push({
    key: 's0',
    icon: 'start',
    text: `Start at ${pts[0].name}`,
    sub: `Head toward ${pts[1].name} · ${formatDist(firstSegM)}`,
  });
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const c = pts[i + 1];
    const segM = dist(b, c);
    const kind = turnKind(a.x, a.y, b.x, b.y, c.x, c.y);
    const label =
      kind === 'straight'
        ? `Continue past ${b.name}`
        : kind === 'left'
          ? `Turn left at ${b.name}`
          : `Turn right at ${b.name}`;
    steps.push({ key: `s${i}`, icon: kind, text: label, sub: `Walk ${formatDist(segM)} toward ${c.name}` });
  }
  const total = pathDistanceM(path);
  steps.push({
    key: 'arr',
    icon: 'arrive',
    text: `Arrive at ${pts[pts.length - 1].name}`,
    sub: `Total ${formatDist(total)} · ~${formatEta(etaSeconds(total))}`,
  });
  return steps;
}

export function formatDist(m: number): string {
  if (m < 1) return `${Math.round(m * 100)} cm`;
  return `${m < 10 ? m.toFixed(1) : Math.round(m)} m`;
}

export function formatEta(sec: number): string {
  if (sec < 60) return `${Math.max(1, Math.round(sec))} sec`;
  const min = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s === 0 ? `${min} min` : `${min} min ${s}s`;
}

/** Interpolate a point along the route polyline at progress 0..1 (units, not meters). */
export function interpolateAlongRoute(path: string[], t: number): { x: number; y: number } | null {
  const pts = path.map((id) => nodeMap.get(id)).filter((n): n is FloorNode => !!n);
  if (pts.length === 0) return null;
  if (pts.length === 1 || t <= 0) return { x: pts[0].x, y: pts[0].y };
  if (t >= 1) return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    segLens.push(l);
    total += l;
  }
  let target = t * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i]) {
      const f = segLens[i] === 0 ? 0 : target / segLens[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * f,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * f,
      };
    }
    target -= segLens[i];
  }
  return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
}
