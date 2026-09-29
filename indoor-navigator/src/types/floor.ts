export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type RoomKind =
  | 'classroom'
  | 'restroom'
  | 'canteen'
  | 'shop'
  | 'utility'
  | 'elevator'
  | 'faculty'
  | 'office'
  | 'department'
  | 'dean'
  | 'laboratory';

export interface Room extends Rect {
  id: string;
  label: string;
  sub?: string;
  kind: RoomKind;
  facing?: 'top' | 'bottom' | 'left' | 'right'; // which wall the main door faces (default: 'bottom')
  doorWidth?: number;
  gender?: 'male' | 'female';        // for restrooms
  points?: [number, number][];       // optional polygon for L-shaped rooms like Shop-5
}

export type ZoneKind = 'courtyard' | 'evacuation' | 'stage';

export interface Zone extends Rect {
  id: string;
  label: string;
  kind: ZoneKind;
}

export interface Hallway extends Rect {
  id: string;
}

export interface Stairs extends Rect {
  id: string;
  direction: 'up' | 'down' | 'both';
}

export interface Elevator extends Rect {
  id: string;
}

export interface Door {
  id: string;
  x: number;
  y: number;
  side: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
  roomId?: string;                   // which room it belongs to
}

export interface Pillar {
  x: number;
  y: number;
}

export interface Marker {
  id: string;
  x: number;
  y: number;
  icon: 'exit' | 'elevator' | 'electrical' | 'info';
  label?: string;
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  building: string;                  // "New Era University"
  width: number;
  height: number;
  north?: number;                    // compass rotation in degrees, 0 = up
  rooms: Room[];
  zones?: Zone[];
  hallways: Hallway[];
  stairs?: Stairs[];
  elevators?: Elevator[];
  doors?: Door[];
  pillars?: Pillar[];
  markers?: Marker[];
}