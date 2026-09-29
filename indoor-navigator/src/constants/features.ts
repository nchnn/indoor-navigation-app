/*
 * File: src/constants/features.ts
 * Static features list displayed on the Dashboard.
 */

import { type IconName } from '../components/common/Icon';

export interface Feature {
  title: string;
  desc: string;
  icon: IconName;
  tag: string;
}

export const FEATURES_LIST: Feature[] = [
  {
    title: 'Turn-by-Turn Wayfinding',
    desc: 'Instant shortest-path generation with A* algorithm and step navigation guidance.',
    icon: 'footprints',
    tag: 'Navigation',
  },
  {
    title: 'Interactive 2D Floor Plan',
    desc: 'Vector architectural floor plan with pinch-zoom, pan, and tactile room checkpoints.',
    icon: 'layers',
    tag: 'Mapping',
  },
  {
    title: 'Pedestrian Dead Reckoning',
    desc: 'Device sensor step detection and compass heading for real-time indoor positioning.',
    icon: 'compass',
    tag: 'Sensors',
  },
];
