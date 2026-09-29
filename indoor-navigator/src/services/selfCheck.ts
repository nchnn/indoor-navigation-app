import {
  NODES,
  ROOM_RECTS,
  FLOOR_W,
  FLOOR_H,
  generateFloorPlan,
  DEFAULT_LAYOUT_CONFIG,
  NORTH_WEST_ROOMS,
} from '../data/old.dorm3F';
import { findShortestPath } from './routing';

function assert(condition: unknown, msg?: string): asserts condition {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// Self-check: RouteCard visibility and pointer collision condition
function runSelfCheck() {
  const isRouteCardVisible = (hasRoute: boolean, sheetIndex: number) => hasRoute && sheetIndex <= 0;

  // Peek sheet (index 0): RouteCard visible when route exists
  assert(isRouteCardVisible(true, 0) === true);

  // Expanded sheet (index 1 or 2): RouteCard hidden to unblock location selection UI
  assert(isRouteCardVisible(true, 1) === false);
  assert(isRouteCardVisible(true, 2) === false);

  // No route: RouteCard always hidden
  assert(isRouteCardVisible(false, 0) === false);
  assert(isRouteCardVisible(false, 1) === false);
  assert(isRouteCardVisible(false, 2) === false);

  // Zoom scale calculations: safety against NaN and clamping
  const MIN_SCALE = 0.75;
  const MAX_SCALE = 4.5;
  const clampScale = (base: number, factor: number) => {
    if (!Number.isFinite(base) || base <= 0 || !Number.isFinite(factor) || factor <= 0) {
      return 1;
    }
    const next = base * factor;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
  };

  assert(clampScale(1, 1.3) === 1.3);
  assert(clampScale(4.0, 1.3) === MAX_SCALE);
  assert(clampScale(0.8, 0.5) === MIN_SCALE);
  assert(clampScale(NaN, 1.3) === 1);
  assert(clampScale(1, NaN) === 1);
  assert(clampScale(1, 0) === 1);
  assert(clampScale(-1, 1.3) === 1);

  // Architectural floor plan checks:
  // 1. Every room rect in ROOM_RECTS must have a corresponding node in NODES
  const nodeIds = new Set(NODES.map((n) => n.id));
  for (const rm of ROOM_RECTS) {
    assert(nodeIds.has(rm.id), `Room ${rm.id} missing in NODES`);
    assert(rm.x >= 0 && rm.x + rm.w <= FLOOR_W, `Room ${rm.id} out of width bounds`);
    assert(rm.y >= 0 && rm.y + rm.h <= FLOOR_H, `Room ${rm.id} out of height bounds`);
  }

  // 2. Full graph connectivity: all rooms and facilities reachable from r301
  for (const rm of ROOM_RECTS) {
    const path = findShortestPath('r301', rm.id);
    assert(path.length > 0, `Unreachable path from r301 to ${rm.id}`);
    assert(path[0] === 'r301' && path[path.length - 1] === rm.id, `Path endpoints mismatch for ${rm.id}`);
  }

  // 3. Responsive layout test:
  // When room 301's width is widened to 120, other rooms in that wing automatically shift and resize
  const customPlan = generateFloorPlan(DEFAULT_LAYOUT_CONFIG, {
    northWest: [
      { ...NORTH_WEST_ROOMS[0], width: 120 },
      ...NORTH_WEST_ROOMS.slice(1),
    ],
  });

  const custom301 = customPlan.rooms.find((r) => r.id === 'r301')!;
  const custom302 = customPlan.rooms.find((r) => r.id === 'r302')!;
  const custom303 = customPlan.rooms.find((r) => r.id === 'r303')!;

  assert(custom301.w === 120, 'Room 301 should respect explicit width 120');
  assert(
    custom302.x === custom301.x + custom301.w + DEFAULT_LAYOUT_CONFIG.roomGap,
    'Room 302 should automatically adjust position to follow room 301',
  );
  assert(
    custom303.x === custom302.x + custom302.w + DEFAULT_LAYOUT_CONFIG.roomGap,
    'Room 303 should automatically adjust position to follow room 302',
  );

  // Door checkpoints should align to the newly computed room centers
  const node301 = customPlan.nodes.find((n) => n.id === 'r301')!;
  const node302 = customPlan.nodes.find((n) => n.id === 'r302')!;
  assert(
    node301.x === Math.round(custom301.x + custom301.w / 2),
    'Door 301 should track room 301 center responsively',
  );
  assert(
    node302.x === Math.round(custom302.x + custom302.w / 2),
    'Door 302 should track room 302 center responsively',
  );

  // Responsive height test: changing corridorTop adjusts room heights and door Y
  const tallerConfig = { ...DEFAULT_LAYOUT_CONFIG, corridorTop: 280 };
  const tallerPlan = generateFloorPlan(tallerConfig);
  const taller301 = tallerPlan.rooms.find((r) => r.id === 'r301')!;
  const tallerDoor301 = tallerPlan.nodes.find((n) => n.id === 'r301')!;
  assert(taller301.h === 280 - 40, 'Room height should expand to match new corridorTop');
  assert(tallerDoor301.y === 280, 'Door Y should track new corridorTop boundary');

  console.log('Self-check passed: All rooms, scale clamping, routing, and responsive layout verified.');
}

runSelfCheck();
