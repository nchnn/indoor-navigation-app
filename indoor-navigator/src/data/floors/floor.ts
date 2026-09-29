// Re-export canonical types — do not redefine them here.
export type { Floor, Room, Hallway } from '../../types/floor';
import type { Floor } from '../../types/floor';

export const FLOORS: Floor[] = [
  {
    id: 'floor-1',
    name: 'Ground Floor',
    level: 1,
    building: 'New Era University',
    width: 700,
    height: 1500,
    rooms: [
      { id: 'room-101', label: 'Room 101', kind: 'classroom', x: 50,  y: 50,  w: 150, h: 100, facing:'right' },
      { id: 'room-102', label: 'Room 102', kind: 'classroom', x: 250, y: 50,  w: 150, h: 100 },
      { id: 'room-103', label: 'Room 103', kind: 'classroom', x: 450, y: 50,  w: 150, h: 100 },
      { id: 'lobby',    label: 'Lobby',    kind: 'office',    x: 50,  y: 250, w: 250, h: 150 },
    ],
    hallways: [
      { id: 'hallway-1', x: 50, y: 160, w: 700, h: 90 },
    ],
  },
];