// ─── 3rd Floor Dormitory parametric layout engine ─────────────────────────────
// Coordinate space: 1000 x 620. 1 unit ≈ 0.06 m (≈60 m building length).
// Responsive layout: changing room width, flex weight, or wing dimensions
// causes all adjacent rooms to recalculate positions and widths automatically.

export const FLOOR_W = 1000;
export const FLOOR_H = 620;
export const METERS_PER_UNIT = 0.06;

export type NodeType =
  | 'room'
  | 'facility'
  | 'hallway'
  | 'corner'
  | 'stairs'
  | 'elevator'
  | 'exit';

export interface FloorNode {
  id: string;
  name: string;
  short: string;
  type: NodeType;
  x: number;
  y: number;
  /** grouping for filters / lists */
  group: 'Rooms' | 'Facilities' | 'Circulation' | 'Checkpoints';
  detail?: string;
}

export interface FloorEdge {
  from: string;
  to: string;
}

export interface RoomRect {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'room' | 'facility-room' | 'circulation-room';
  icon?: string;
}

export interface RoomSpec {
  id: string;
  label: string;
  sub: string;
  kind: 'room' | 'facility-room' | 'circulation-room';
  icon?: string;
  group: 'Rooms' | 'Facilities' | 'Circulation' | 'Checkpoints';
  detail?: string;
  nodeType?: NodeType;
  name?: string;
  short?: string;
  /** Explicit fixed width in units. Overrides flex weight. */
  width?: number;
  /** Explicit fixed height in units. Overrides default wing height. */
  height?: number;
  /** Proportional flex share (default 1). Remaining wing width is divided by flex. */
  flex?: number;
  /** Door X position ratio along room width (0 to 1). Defaults to 0.5 (centered). */
  doorRatio?: number;
  /** Vertical alignment when room height is smaller than wing height ('corridor' | 'outer'). Defaults to 'corridor'. */
  align?: 'corridor' | 'outer';
}

export interface FloorLayoutConfig {
  floorW: number;
  floorH: number;
  slabMargin: number;
  corridorTop: number;
  corridorBottom: number;
  corridorLeft: number;
  corridorRight: number;
  lobbyLeft: number;
  lobbyRight: number;
  roomGap: number;
}

export const DEFAULT_LAYOUT_CONFIG: FloorLayoutConfig = {
  floorW: FLOOR_W,
  floorH: FLOOR_H,
  slabMargin: 15,
  corridorTop: 300,
  corridorBottom: 355,
  corridorLeft: 100,
  corridorRight: 930,
  lobbyLeft: 445,
  lobbyRight: 555,
  roomGap: 6,
};

export const LAYOUT = {
  slab: {
    x: DEFAULT_LAYOUT_CONFIG.slabMargin,
    y: DEFAULT_LAYOUT_CONFIG.slabMargin,
    w: DEFAULT_LAYOUT_CONFIG.floorW - DEFAULT_LAYOUT_CONFIG.slabMargin * 2,
    h: DEFAULT_LAYOUT_CONFIG.floorH - DEFAULT_LAYOUT_CONFIG.slabMargin * 2,
  },
  hallway: {
    x: DEFAULT_LAYOUT_CONFIG.corridorLeft,
    y: DEFAULT_LAYOUT_CONFIG.corridorTop,
    w: DEFAULT_LAYOUT_CONFIG.corridorRight - DEFAULT_LAYOUT_CONFIG.corridorLeft,
    h: DEFAULT_LAYOUT_CONFIG.corridorBottom - DEFAULT_LAYOUT_CONFIG.corridorTop,
    centerY: (DEFAULT_LAYOUT_CONFIG.corridorTop + DEFAULT_LAYOUT_CONFIG.corridorBottom) / 2,
  },
  lobby: {
    x: DEFAULT_LAYOUT_CONFIG.lobbyLeft,
    y: 35,
    w: DEFAULT_LAYOUT_CONFIG.lobbyRight - DEFAULT_LAYOUT_CONFIG.lobbyLeft,
    h: 550,
    centerX: (DEFAULT_LAYOUT_CONFIG.lobbyLeft + DEFAULT_LAYOUT_CONFIG.lobbyRight) / 2,
  },
  northRooms: {
    y: 40,
    h: DEFAULT_LAYOUT_CONFIG.corridorTop - 40,
  },
  southRooms: {
    y: DEFAULT_LAYOUT_CONFIG.corridorBottom,
    h: DEFAULT_LAYOUT_CONFIG.floorH - 40 - DEFAULT_LAYOUT_CONFIG.corridorBottom,
  },
};

export const NORTH_WEST_ROOMS: RoomSpec[] = [
  { id: 'r301', label: '301', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'North wing · 4 beds', flex: 1 },
  { id: 'r302', label: '302', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'North wing · 4 beds', flex: 1 },
  { id: 'r303', label: '303', sub: '2 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'North wing · 2 beds', flex: 1 },
  { id: 'f-ra', label: 'RA Office', sub: 'Staff', kind: 'facility-room', icon: 'briefcase', group: 'Facilities', detail: 'Resident Assistant · North wing', nodeType: 'facility', flex: 0.77 },
  { id: 'f-janitor', label: 'Janitor', sub: 'Storage', kind: 'facility-room', icon: 'spray-can', group: 'Facilities', detail: 'Staff only · North wing', nodeType: 'facility', flex: 0.67 },
];

export const NORTH_EAST_ROOMS: RoomSpec[] = [
  { id: 'f-kitchen', label: 'Kitchen', sub: 'Pantry', kind: 'facility-room', icon: 'cooking-pot', group: 'Facilities', detail: 'Pantry & microwaves · East wing', nodeType: 'facility', flex: 1 },
  { id: 'f-vending', label: 'Vending', sub: 'Snacks', kind: 'facility-room', icon: 'cup-soda', group: 'Facilities', detail: 'Snacks & drinks · East wing', nodeType: 'facility', flex: 0.72 },
  { id: 'r304', label: '304', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'North wing · 4 beds', flex: 1 },
  { id: 'r305', label: '305', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'North wing · 4 beds', flex: 1 },
  { id: 'r306', label: '306', sub: '2 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'North wing · 2 beds', flex: 1 },
];

export const SOUTH_WEST_ROOMS: RoomSpec[] = [
  { id: 'r307', label: '307', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'South wing · 4 beds', flex: 1 },
  { id: 'r308', label: '308', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'South wing · 4 beds', flex: 1 },
  { id: 'r309', label: '309', sub: '2 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'South wing · 2 beds', flex: 1 },
  { id: 'f-laundry', label: 'Laundry', sub: 'Washers', kind: 'facility-room', icon: 'washing-machine', group: 'Facilities', detail: 'Washers & dryers · South wing', nodeType: 'facility', flex: 0.77 },
  { id: 'f-prayer', label: 'Prayer Room', sub: 'Quiet', kind: 'facility-room', icon: 'hand', group: 'Facilities', detail: 'Quiet space · South wing', nodeType: 'facility', flex: 0.67 },
];

export const SOUTH_EAST_ROOMS: RoomSpec[] = [
  { id: 'f-crm', label: 'Restroom M', sub: 'Showers', kind: 'facility-room', icon: 'user', group: 'Facilities', detail: 'Men · Showers · East wing', nodeType: 'facility', flex: 0.77 },
  { id: 'f-crf', label: 'Restroom F', sub: 'Showers', kind: 'facility-room', icon: 'user', group: 'Facilities', detail: 'Women · Showers · East wing', nodeType: 'facility', flex: 0.77 },
  { id: 'r310', label: '310', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'South wing · 4 beds', flex: 1 },
  { id: 'r311', label: '311', sub: '4 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'South wing · 4 beds', flex: 1 },
  { id: 'r312', label: '312', sub: '2 beds', kind: 'room', icon: 'bed-double', group: 'Rooms', detail: 'South wing · 2 beds', flex: 1 },
];

/**
 * Responsive solver: Given a list of room specs, computes positions and widths.
 * If one room defines a fixed width, remaining width divides among flex rooms.
 * All positions chain sequentially (no overlaps, no empty holes).
 */
export function solveWing(
  specs: RoomSpec[],
  startX: number,
  totalW: number,
  y: number,
  h: number,
  gap: number,
  isNorth: boolean,
): { rooms: RoomRect[]; nodes: FloorNode[] } {
  const totalGaps = gap * Math.max(0, specs.length - 1);
  const fixedSum = specs.reduce((acc, r) => acc + (r.width ?? 0), 0);
  const flexSum = specs.reduce((acc, r) => acc + (r.width == null ? (r.flex ?? 1) : 0), 0);

  const remainingW = Math.max(0, totalW - fixedSum - totalGaps);
  const unitFlex = flexSum > 0 ? remainingW / flexSum : 0;

  let currentX = startX;
  const rooms: RoomRect[] = [];
  const nodes: FloorNode[] = [];

  for (const s of specs) {
    const w = Math.round(s.width != null ? s.width : (s.flex ?? 1) * unitFlex);
    const roomH = s.height != null ? s.height : h;
    const align = s.align ?? 'corridor';

    let roomY = y;
    if (isNorth) {
      roomY = align === 'corridor' ? y + (h - roomH) : y;
    } else {
      roomY = align === 'corridor' ? y : y + (h - roomH);
    }

    rooms.push({
      id: s.id,
      label: s.label,
      sub: s.sub,
      x: currentX,
      y: roomY,
      w,
      h: roomH,
      kind: s.kind,
      icon: s.icon,
    });

    const ratio = s.doorRatio ?? 0.5;
    const doorX = Math.round(currentX + w * ratio);
    const doorY = isNorth ? roomY + roomH : roomY;

    nodes.push({
      id: s.id,
      name: s.name ?? (s.kind === 'room' ? `Room ${s.label}` : s.label),
      short: s.short ?? s.label,
      type: s.nodeType ?? (s.kind === 'room' ? 'room' : 'facility'),
      x: doorX,
      y: doorY,
      group: s.group,
      detail: s.detail,
    });

    currentX += w + gap;
  }

  return { rooms, nodes };
}

function buildCentralRooms(config: FloorLayoutConfig): RoomRect[] {
  const hH = config.corridorBottom - config.corridorTop;
  const lW = config.lobbyRight - config.lobbyLeft;
  return [
    { id: 'stair-a', label: 'Stair A', sub: 'West exit', x: 22, y: config.corridorTop, w: config.corridorLeft - 22, h: hH, kind: 'circulation-room', icon: 'stairs' },
    { id: 'stair-b', label: 'Stair B', sub: 'East exit', x: config.corridorRight, y: config.corridorTop, w: 48, h: hH, kind: 'circulation-room', icon: 'stairs' },
    { id: 'f-study', label: 'Study Hall', sub: 'Quiet zone', x: config.lobbyLeft + 10, y: 40, w: lW - 20, h: 125, kind: 'facility-room', icon: 'book-open' },
    { id: 'elevator', label: 'Elevator', sub: 'Central lift', x: config.lobbyLeft + 15, y: 175, w: lW - 30, h: config.corridorTop - 175, kind: 'circulation-room', icon: 'arrow-up-down' },
    { id: 'f-lounge', label: 'Lounge', sub: 'TV & Sofas', x: config.lobbyLeft + 10, y: config.corridorBottom, w: lW - 20, h: 160, kind: 'facility-room', icon: 'sofa' },
  ];
}

function buildHallwayNodes(
  config: FloorLayoutConfig,
  roomNodes: FloorNode[],
): FloorNode[] {
  const corridorCenterY = (config.corridorTop + config.corridorBottom) / 2;
  const lobbyCenterX = (config.lobbyLeft + config.lobbyRight) / 2;

  const doorMap = new Map<string, FloorNode>(roomNodes.map((n) => [n.id, n]));
  const h2X = Math.round(((doorMap.get('r302')?.x ?? 198) + (doorMap.get('r308')?.x ?? 198)) / 2);
  const h3X = Math.round(((doorMap.get('r303')?.x ?? 282) + (doorMap.get('r309')?.x ?? 282)) / 2);
  const h4X = Math.round(((doorMap.get('f-ra')?.x ?? 360) + (doorMap.get('f-laundry')?.x ?? 360)) / 2);
  const h6X = Math.round(((doorMap.get('f-vending')?.x ?? 630) + (doorMap.get('f-crf')?.x ?? 630)) / 2);
  const h7X = Math.round(((doorMap.get('r304')?.x ?? 720) + (doorMap.get('r310')?.x ?? 720)) / 2);
  const h8X = Math.round(((doorMap.get('r305')?.x ?? 800) + (doorMap.get('r311')?.x ?? 800)) / 2);

  return [
    { id: 'c-west', name: 'West Corridor', short: 'CW', type: 'corner', x: config.corridorLeft, y: corridorCenterY, group: 'Checkpoints', detail: 'West stairwell lobby' },
    { id: 'h2', name: 'Hallway H2', short: 'H2', type: 'hallway', x: h2X, y: corridorCenterY, group: 'Checkpoints', detail: 'Near rooms 302/308' },
    { id: 'h3', name: 'Hallway H3', short: 'H3', type: 'hallway', x: h3X, y: corridorCenterY, group: 'Checkpoints', detail: 'Near rooms 303/309' },
    { id: 'h4', name: 'Hallway H4', short: 'H4', type: 'hallway', x: h4X, y: corridorCenterY, group: 'Checkpoints', detail: 'Near facilities' },
    { id: 'h5', name: 'Central Lobby', short: 'L5', type: 'corner', x: lobbyCenterX, y: corridorCenterY, group: 'Checkpoints', detail: 'Central elevator lobby' },
    { id: 'h6', name: 'Hallway H6', short: 'H6', type: 'hallway', x: h6X, y: corridorCenterY, group: 'Checkpoints', detail: 'Near vending & restrooms' },
    { id: 'h7', name: 'Hallway H7', short: 'H7', type: 'hallway', x: h7X, y: corridorCenterY, group: 'Checkpoints', detail: 'Near rooms 304/310' },
    { id: 'h8', name: 'Hallway H8', short: 'H8', type: 'hallway', x: h8X, y: corridorCenterY, group: 'Checkpoints', detail: 'Near rooms 305/311' },
    { id: 'c-east', name: 'East Corridor', short: 'CE', type: 'hallway', x: config.corridorRight, y: corridorCenterY, group: 'Checkpoints', detail: 'East stairwell lobby' },
    { id: 'c-north', name: 'Study Hall Door', short: 'ST', type: 'corner', x: lobbyCenterX, y: 165, group: 'Checkpoints', detail: 'North lobby' },
    { id: 'v-n2', name: 'North Lobby Mid', short: 'LN', type: 'hallway', x: lobbyCenterX, y: 225, group: 'Checkpoints', detail: 'Lobby near elevator' },
    { id: 'v-s1', name: 'South Lobby Mid', short: 'LS', type: 'hallway', x: lobbyCenterX, y: 430, group: 'Checkpoints', detail: 'Lounge entrance' },
    { id: 'c-south', name: 'South Atrium', short: 'SA', type: 'corner', x: lobbyCenterX, y: 535, group: 'Checkpoints', detail: 'South lobby lounge' },
    { id: 'stair-a', name: 'Stair A (West)', short: 'SA', type: 'stairs', x: config.corridorLeft, y: corridorCenterY, group: 'Circulation', detail: 'West stairwell' },
    { id: 'stair-b', name: 'Stair B (East)', short: 'SB', type: 'stairs', x: config.corridorRight, y: corridorCenterY, group: 'Circulation', detail: 'East stairwell' },
    { id: 'elevator', name: 'Elevator', short: 'EL', type: 'elevator', x: lobbyCenterX, y: config.corridorTop, group: 'Circulation', detail: 'Central lobby lift' },
    { id: 'exit-w', name: 'Fire Exit West', short: 'XW', type: 'exit', x: 26, y: corridorCenterY, group: 'Circulation', detail: 'West emergency exit' },
    { id: 'exit-e', name: 'Fire Exit East', short: 'XE', type: 'exit', x: 974, y: corridorCenterY, group: 'Circulation', detail: 'East emergency exit' },
    { id: 'f-study', name: 'Study Hall', short: 'ST', type: 'facility', x: lobbyCenterX, y: 165, group: 'Facilities', detail: 'Quiet zone · North lobby' },
    { id: 'f-lounge', name: 'Lounge / TV', short: 'TV', type: 'facility', x: lobbyCenterX, y: config.corridorBottom, group: 'Facilities', detail: 'Sofas & TV · South lobby' },
  ];
}

const DEFAULT_EDGES: FloorEdge[] = [
  // spine
  { from: 'c-west', to: 'h2' },
  { from: 'h2', to: 'h3' },
  { from: 'h3', to: 'h4' },
  { from: 'h4', to: 'h5' },
  { from: 'h5', to: 'h6' },
  { from: 'h6', to: 'h7' },
  { from: 'h7', to: 'h8' },
  { from: 'h8', to: 'c-east' },
  // vertical lobby
  { from: 'c-north', to: 'v-n2' },
  { from: 'v-n2', to: 'h5' },
  { from: 'h5', to: 'v-s1' },
  { from: 'v-s1', to: 'c-south' },
  // north rooms
  { from: 'r301', to: 'c-west' },
  { from: 'r301', to: 'h2' },
  { from: 'r302', to: 'h2' },
  { from: 'r303', to: 'h3' },
  { from: 'f-ra', to: 'h3' },
  { from: 'f-ra', to: 'h4' },
  { from: 'f-janitor', to: 'h4' },
  { from: 'f-janitor', to: 'h5' },
  { from: 'f-study', to: 'c-north' },
  { from: 'f-study', to: 'v-n2' },
  { from: 'elevator', to: 'v-n2' },
  { from: 'elevator', to: 'h5' },
  { from: 'f-kitchen', to: 'h5' },
  { from: 'f-kitchen', to: 'h6' },
  { from: 'f-vending', to: 'h6' },
  { from: 'r304', to: 'h6' },
  { from: 'r304', to: 'h7' },
  { from: 'r305', to: 'h7' },
  { from: 'r305', to: 'h8' },
  { from: 'r306', to: 'h8' },
  { from: 'r306', to: 'c-east' },
  // south rooms
  { from: 'r307', to: 'c-west' },
  { from: 'r307', to: 'h2' },
  { from: 'r308', to: 'h2' },
  { from: 'r309', to: 'h3' },
  { from: 'f-laundry', to: 'h3' },
  { from: 'f-laundry', to: 'h4' },
  { from: 'f-prayer', to: 'h4' },
  { from: 'f-prayer', to: 'h5' },
  { from: 'f-lounge', to: 'v-s1' },
  { from: 'f-crm', to: 'h5' },
  { from: 'f-crm', to: 'h6' },
  { from: 'f-crf', to: 'h6' },
  { from: 'r310', to: 'h6' },
  { from: 'r310', to: 'h7' },
  { from: 'r311', to: 'h7' },
  { from: 'r311', to: 'h8' },
  { from: 'r312', to: 'h8' },
  { from: 'r312', to: 'c-east' },
  // circulation
  { from: 'exit-w', to: 'stair-a' },
  { from: 'stair-a', to: 'c-west' },
  { from: 'c-east', to: 'stair-b' },
  { from: 'stair-b', to: 'exit-e' },
];

export function generateFloorPlan(
  config: FloorLayoutConfig = DEFAULT_LAYOUT_CONFIG,
  customSpecs?: {
    northWest?: RoomSpec[];
    northEast?: RoomSpec[];
    southWest?: RoomSpec[];
    southEast?: RoomSpec[];
  },
) {
  const nwSpecs = customSpecs?.northWest ?? NORTH_WEST_ROOMS;
  const neSpecs = customSpecs?.northEast ?? NORTH_EAST_ROOMS;
  const swSpecs = customSpecs?.southWest ?? SOUTH_WEST_ROOMS;
  const seSpecs = customSpecs?.southEast ?? SOUTH_EAST_ROOMS;

  const westStartX = config.corridorLeft + 5;
  const westTotalW = config.lobbyLeft - 10 - westStartX;
  const eastStartX = config.lobbyRight + 10;
  const eastTotalW = config.corridorRight - 5 - eastStartX;

  const northY = 40;
  const northH = config.corridorTop - northY;
  const southY = config.corridorBottom;
  const southH = config.floorH - 40 - southY;

  const nw = solveWing(nwSpecs, westStartX, westTotalW, northY, northH, config.roomGap, true);
  const ne = solveWing(neSpecs, eastStartX, eastTotalW, northY, northH, config.roomGap, true);
  const sw = solveWing(swSpecs, westStartX, westTotalW, southY, southH, config.roomGap, false);
  const se = solveWing(seSpecs, eastStartX, eastTotalW, southY, southH, config.roomGap, false);

  const roomNodes = [...nw.nodes, ...ne.nodes, ...sw.nodes, ...se.nodes];
  const centralRooms = buildCentralRooms(config);
  const hallwayNodes = buildHallwayNodes(config, roomNodes);

  return {
    rooms: [...nw.rooms, ...ne.rooms, ...sw.rooms, ...se.rooms, ...centralRooms],
    nodes: [...roomNodes, ...hallwayNodes],
    edges: DEFAULT_EDGES,
    config,
  };
}

const defaultPlan = generateFloorPlan();

export const ROOM_RECTS: RoomRect[] = defaultPlan.rooms;
export const NODES: FloorNode[] = defaultPlan.nodes;
export const EDGES: FloorEdge[] = defaultPlan.edges;

// ─── Repository (mock today, DB tomorrow) ──────────────────────────
export interface FloorRepository {
  getNodes(): FloorNode[];
  getEdges(): FloorEdge[];
  getRooms(): RoomRect[];
}

export const mockFloorRepository: FloorRepository = {
  getNodes: () => NODES,
  getEdges: () => EDGES,
  getRooms: () => ROOM_RECTS,
};

export const nodeById = (id: string): FloorNode | undefined =>
  NODES.find((n) => n.id === id);

export const selectableNodes = (): FloorNode[] => NODES;
