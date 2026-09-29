/*
 * File: src/constants/shortcuts.ts
 * Static quick-shortcut destination list displayed on the Dashboard.
 */

import { type IconName } from '../components/common/Icon';

export interface Shortcut {
  id: string;
  name: string;
  category: string;
  icon: IconName;
  detail: string;
}

export const QUICK_SHORTCUTS: Shortcut[] = [
  {
    id: 'f-laundry',
    name: 'Laundry Facility',
    category: 'Facility',
    icon: 'washing-machine',
    detail: 'West wing wash & dry center',
  },
  {
    id: 'f-study',
    name: 'Study Lounge',
    category: 'Facility',
    icon: 'book-open',
    detail: 'Quiet study & group work',
  },
  {
    id: 'f-stairs-n',
    name: 'North Stairwell',
    category: 'Circulation',
    icon: 'stairs',
    detail: 'Vertical access & exit north',
  },
  {
    id: 'f-stairs-s',
    name: 'South Stairwell',
    category: 'Circulation',
    icon: 'stairs',
    detail: 'Vertical access & exit south',
  },
];
