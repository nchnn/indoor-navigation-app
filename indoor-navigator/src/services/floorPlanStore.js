// floorPlanStore.js — editable entity model + persistence (floorplancreator-style).
// Entities are plain rects with a kind:
//   room:  { id, kind:'room', x, y, width, height, door? }
//   cr:    { id, kind:'cr', x, y, width, height, crType:'male'|'female'|'split', doorPosition }
//   stair: { id, kind:'stair', x, y, width, height, facing, upSide, hasBelow }
// door: { wall:'top'|'bottom'|'left'|'right', type:'single'|'double', swing:'in'|'out', hinge:'left'|'right' }
// Missing kind is treated as 'room' (backward compat with room-only saves).

export const FLOOR_W = 8000;
export const FLOOR_H = 3500;
export const SNAP = 10;
export const MIN_SIZE = 60;
export const STORAGE_KEY = 'guideme.floorplan.v1';

export const ENTITY_KINDS = ['room', 'cr', 'stair'];

export function normalizeKind(k) {
  const s = String(k ?? 'room').toLowerCase();
  if (s === 'cr' || s === 'comfort' || s === 'comfortroom' || s === 'comfort-room') return 'cr';
  if (s === 'stair' || s === 'stairs' || s === 'staircase') return 'stair';
  return 'room';
}

export const kindOf = (e) => normalizeKind(e?.kind);

export function kindLabel(kind) {
  const k = normalizeKind(kind);
  return k === 'cr' ? 'CR' : k === 'stair' ? 'Stair' : 'Room';
}

export function entityDisplayName(entity) {
  if (!entity) return '';
  return entity.label !== undefined ? entity.label : entity.id;
}

export function entityTitle(entity) {
  if (!entity) return '';
  const k = kindOf(entity);
  const name = entityDisplayName(entity);
  const prefix = k === 'cr' ? 'CR' : k === 'stair' ? 'Stair' : 'Room';
  return name ? `${prefix} ${name}` : `${prefix} (no name)`;
}

function normalizeCRType(t) {
  const s = String(t ?? 'male').toLowerCase();
  return s === 'female' ? 'female' : s === 'split' ? 'split' : 'male';
}

function normalizeDoorPos(p) {
  const k = String(p ?? 'bottomLeft').toLowerCase().replace(/[\s_-]/g, '');
  if (k === 'topleft' || k === 'lefttop' || k === 'top') return 'topLeft';
  if (k === 'topright' || k === 'righttop') return 'topRight';
  if (k === 'bottomright' || k === 'rightbottom') return 'bottomRight';
  return 'bottomLeft';
}

function normalizeFacing(f) {
  const s = String(f ?? 'right').toLowerCase();
  return s === 'left' || s === 'up' || s === 'down' ? s : 'right';
}

function normalizeUpSide(u) {
  const s = String(u ?? 'left').toLowerCase();
  return s === 'right' ? 'right' : 'left';
}

const memory = { rooms: null };

function getAsyncStorage() {
  try {
    // Optional dep — works without installing when absent (in-memory fallback).
    // eslint-disable-next-line global-require
    const m = require('@react-native-async-storage/async-storage');
    return m?.default ?? m ?? null;
  } catch {
    return null;
  }
}

export const snap = (v) => Math.round(v / SNAP) * SNAP;
export const clampSize = (v) => Math.max(MIN_SIZE, snap(v));

export const DEFAULT_ROOMS = [
  // North wing M118–M122
  { id: 'M118', x: 380, y: 300, width: 300, height: 200 },
  { id: 'M119', x: 680, y: 300, width: 300, height: 200 },
  { id: 'M120', x: 980, y: 300, width: 300, height: 200 },
  { id: 'M121', x: 1280, y: 300, width: 300, height: 200 },
  { id: 'M122', x: 1580, y: 300, width: 300, height: 200 },
  // Large custom room (renamed to keep ids unique — was a duplicate M122)
  { id: 'M123', x: 3000, y: 300, width: 575, height: 300 },
  // West customs
  { id: 'M101', x: 0, y: 0, width: 300, height: 640, door: { wall: 'bottom', hinge: 'left', swing: 'in' } },
  { id: 'M102', x: 500, y: 0, width: 300, height: 640, door: { wall: 'bottom', type: 'double', swing: 'in' } },
  // Middle strip (renamed M211–M207 to avoid colliding with south M107–M112)
  { id: 'M211', x: 1000, y: 500, width: 500, height: 300, door: { wall: 'top', hinge: 'right', swing: 'in' } },
  { id: 'M210', x: 1500, y: 500, width: 500, height: 300, door: { wall: 'top', hinge: 'left', swing: 'in' } },
  { id: 'M209', x: 2000, y: 500, width: 500, height: 300, door: { wall: 'top', hinge: 'right', swing: 'in' } },
  { id: 'M208', x: 2500, y: 500, width: 500, height: 300, door: { wall: 'top', hinge: 'left', swing: 'in' } },
  { id: 'M207', x: 3000, y: 500, width: 500, height: 300, door: { wall: 'top', hinge: 'right', swing: 'in' } },
  // South wing M112–M107 (vertical strip)
  { id: 'M112', x: 380, y: 1800, width: 460, height: 240 },
  { id: 'M111', x: 380, y: 2040, width: 460, height: 240 },
  { id: 'M110', x: 380, y: 2280, width: 460, height: 240 },
  { id: 'M109', x: 380, y: 2520, width: 460, height: 240 },
  { id: 'M108', x: 380, y: 2760, width: 460, height: 240 },
  { id: 'M107', x: 380, y: 3000, width: 460, height: 240 },
  // Default editable fixtures (were a static layer — now selectable/resizable)
  { id: 'ST1', kind: 'stair', x: 1500, y: 1500, width: 300, height: 200, facing: 'right', upSide: 'left', hasBelow: false },
  { id: 'CR1', kind: 'cr', x: 1550, y: 900, width: 150, height: 250, crType: 'female', doorPosition: 'topRight' },
];

export function cloneRooms(rooms) {
  return rooms.map((r) => ({
    ...r,
    door: Array.isArray(r.door)
      ? r.door.map((d) => ({ ...d }))
      : r.door
        ? { ...r.door }
        : undefined,
  }));
}

export function nextEntityId(entities, prefix) {
  const re = new RegExp(`^${prefix}(\\d+)$`, 'i');
  const nums = (entities ?? [])
    .map((e) => {
      const m = re.exec(String(e?.id ?? ''));
      return m ? Number(m[1]) : null;
    })
    .filter((v) => typeof v === 'number' && !Number.isNaN(v));
  const taken = new Set((entities ?? []).map((e) => String(e?.id)));
  let n = nums.length ? Math.max(...nums) + 1 : 1;
  let id = `${prefix}${n}`;
  while (taken.has(id)) {
    n += 1;
    id = `${prefix}${n}`;
  }
  return id;
}

export function nextRoomId(rooms) {
  const nums = rooms
    .map((r) => /^M(\d+)$/.exec(String(r.id))?.[1])
    .filter(Boolean)
    .map(Number);
  const taken = new Set(rooms.map((r) => String(r.id)));
  let n = nums.length ? Math.max(...nums) + 1 : 101;
  let id = `M${n}`;
  while (taken.has(id)) {
    n += 1;
    id = `M${n}`;
  }
  return id;
}

function placeAt(width, height, x = FLOOR_W / 2, y = FLOOR_H / 2) {
  return {
    x: snap(Math.min(Math.max(0, x - width / 2), FLOOR_W - width)),
    y: snap(Math.min(Math.max(0, y - height / 2), FLOOR_H - height)),
  };
}

export function createRoom(rooms, x = FLOOR_W / 2, y = FLOOR_H / 2) {
  const width = 300;
  const height = 240;
  const p = placeAt(width, height, x, y);
  return { id: nextRoomId(rooms), kind: 'room', ...p, width, height };
}

export function createCR(entities, x = FLOOR_W / 2, y = FLOOR_H / 2) {
  const width = 150;
  const height = 250;
  const p = placeAt(width, height, x, y);
  return {
    id: nextEntityId(entities, 'CR'),
    kind: 'cr',
    ...p,
    width,
    height,
    crType: 'male',
    doorPosition: 'bottomLeft',
  };
}

export function createStair(entities, x = FLOOR_W / 2, y = FLOOR_H / 2) {
  const width = 300;
  const height = 200;
  const p = placeAt(width, height, x, y);
  return {
    id: nextEntityId(entities, 'ST'),
    kind: 'stair',
    ...p,
    width,
    height,
    facing: 'right',
    upSide: 'left',
    hasBelow: false,
  };
}

export function createEntity(entities, kind, x = FLOOR_W / 2, y = FLOOR_H / 2) {
  const k = normalizeKind(kind);
  if (k === 'cr') return createCR(entities, x, y);
  if (k === 'stair') return createStair(entities, x, y);
  return createRoom(entities, x, y);
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function parseMId(id) {
  const m = /^M(\d+)$/.exec(String(id ?? ''));
  return m ? Number(m[1]) : null;
}

// Next M-number continuing the row/column counting direction.
// A series is rooms sharing the cross-axis origin (within SNAP) with
// identical size — i.e. a true row or column. Horizontal sides use the
// x-ordered series, vertical sides the y-ordered one.
function nextRoomNameForDuplicate(entities, src, side) {
  const srcNum = parseMId(src.id);
  const horizontal = side === 'l' || side === 'r';
  const row = (entities ?? []).filter((e) => {
    if (e.id === src.id || kindOf(e) !== 'room') return false;
    if (parseMId(e.id) == null) return false;
    if (e.width !== src.width || e.height !== src.height) return false;
    return horizontal
      ? Math.abs(e.y - src.y) <= SNAP
      : Math.abs(e.x - src.x) <= SNAP;
  });
  const ordered = [...row, src].sort((a, b) =>
    horizontal ? a.x - b.x : a.y - b.y,
  );
  let dir = 0;
  if (ordered.length >= 2) {
    dir = Math.sign(
      parseMId(ordered[ordered.length - 1].id) - parseMId(ordered[0].id),
    );
  }
  if (!dir) dir = 1;
  const forward = side === 'r' || side === 'b';
  const taken = new Set((entities ?? []).map((e) => String(e.id)));
  if (srcNum != null) {
    const n = forward ? srcNum + dir : srcNum - dir;
    if (n > 0 && !taken.has(`M${n}`)) return `M${n}`;
  }
  return nextRoomId([...(entities ?? [])]);
}

// Duplicate a room into the cell adjacent to one side ('t'|'b'|'l'|'r')
// with identical attributes. Returns the new entity, or null when the
// target is out of bounds or already occupied.
export function duplicateAdjacent(entities, id, side) {
  const src = (entities ?? []).find((e) => e.id === id);
  if (!src || kindOf(src) !== 'room') return null;
  const dx = side === 'r' ? src.width : side === 'l' ? -src.width : 0;
  const dy = side === 'b' ? src.height : side === 't' ? -src.height : 0;
  if (!dx && !dy) return null;
  const target = {
    ...cloneRooms([src])[0],
    x: src.x + dx,
    y: src.y + dy,
  };
  if (
    target.x < 0 ||
    target.y < 0 ||
    target.x + target.width > FLOOR_W ||
    target.y + target.height > FLOOR_H
  ) {
    return null;
  }
  const blocked = (entities ?? []).some(
    (e) => e.id !== id && rectsOverlap(e, target),
  );
  if (blocked) return null;
  target.id = nextRoomNameForDuplicate(entities, src, side);
  return target;
}

export function sanitizeRooms(input) {
  if (!Array.isArray(input)) return cloneRooms(DEFAULT_ROOMS);
  const out = [];
  const seen = new Set();
  for (const r of input) {
    if (!r || typeof r.x !== 'number' || typeof r.y !== 'number') continue;
    const kind = normalizeKind(r.kind);
    const defW = kind === 'cr' ? 150 : kind === 'stair' ? 300 : 300;
    const defH = kind === 'cr' ? 250 : kind === 'stair' ? 200 : 240;
    let id = String(r.id ?? '').trim() || (
      kind === 'cr' ? nextEntityId(out, 'CR')
        : kind === 'stair' ? nextEntityId(out, 'ST')
          : nextRoomId(out)
    );
    if (seen.has(id)) id = `${id}-${out.length}`;
    seen.add(id);
    const entity = {
      id,
      kind,
      x: snap(Math.min(Math.max(0, r.x), FLOOR_W - MIN_SIZE)),
      y: snap(Math.min(Math.max(0, r.y), FLOOR_H - MIN_SIZE)),
      width: clampSize(r.width ?? defW),
      height: clampSize(r.height ?? defH),
    };
    // Optional display label — blank is allowed. Falls back to id.
    if (typeof r.label === 'string') entity.label = r.label.slice(0, 12);
    if (kind === 'room') {
      if (Array.isArray(r.door)) entity.door = r.door.map((d) => ({ ...d }));
      else if (r.door && typeof r.door === 'object') entity.door = { ...r.door };
    } else if (kind === 'cr') {
      entity.crType = normalizeCRType(r.crType ?? r.type);
      entity.doorPosition = normalizeDoorPos(r.doorPosition);
    } else if (kind === 'stair') {
      entity.facing = normalizeFacing(r.facing);
      entity.upSide = normalizeUpSide(r.upSide);
      entity.hasBelow = Boolean(r.hasBelow);
    }
    out.push(entity);
  }
  return out.length ? out : cloneRooms(DEFAULT_ROOMS);
}

export async function loadFloorPlan() {
  if (memory.rooms) return cloneRooms(memory.rooms);
  const store = getAsyncStorage();
  if (!store) return cloneRooms(DEFAULT_ROOMS);
  try {
    const raw = await store.getItem(STORAGE_KEY);
    if (!raw) return cloneRooms(DEFAULT_ROOMS);
    return sanitizeRooms(JSON.parse(raw));
  } catch {
    return cloneRooms(DEFAULT_ROOMS);
  }
}

export async function saveFloorPlan(rooms) {
  memory.rooms = cloneRooms(rooms);
  const store = getAsyncStorage();
  if (!store) return false;
  try {
    await store.setItem(STORAGE_KEY, JSON.stringify(rooms));
    return true;
  } catch {
    return false;
  }
}

export async function resetFloorPlan() {
  memory.rooms = cloneRooms(DEFAULT_ROOMS);
  const store = getAsyncStorage();
  if (!store) return cloneRooms(DEFAULT_ROOMS);
  try {
    await store.removeItem(STORAGE_KEY);
  } catch {
    // ignore — memory already reset
  }
  return cloneRooms(DEFAULT_ROOMS);
}
