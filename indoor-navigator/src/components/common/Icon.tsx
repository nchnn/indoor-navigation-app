// ─── SVG Icon library — Lucide paths, no emoji ────────────────────────────────
// Source: https://lucide.dev/icons/ (MIT). 24×24 viewBox, stroke-based.
// Usage: <Icon name="map-pin" size={20} color={theme.colors.ink} />

import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { theme } from '../../theme';

export type IconName =
  | 'map-pin' | 'crosshair' | 'target'
  | 'arrow-up' | 'arrow-left' | 'arrow-right' | 'arrow-up-down' | 'arrow-left-right'
  | 'flag' | 'play' | 'pause' | 'square' | 'x'
  | 'satellite' | 'footprints'
  | 'bed-double' | 'briefcase' | 'spray-can' | 'cooking-pot' | 'cup-soda'
  | 'washing-machine' | 'hand' | 'stairs' | 'book-open' | 'sofa' | 'door-open'
  | 'sparkles' | 'user'
  | 'search' | 'log-in' | 'log-out' | 'compass' | 'layers' | 'shield-check' | 'chevron-right' | 'map'
  | 'globe' | 'building' | 'accessibility' | 'navigation' | 'lock' | 'check' | 'graduation-cap' | 'eye' | 'google'
  | 'plus' | 'minus' | 'locate';

interface Props { name: IconName; size?: number; color?: string }

const S = { fill: 'none' as const, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export default function Icon({ name, size = 24, color = theme.colors.ink }: Props) {
  const s = { ...S, stroke: color };
  return <Svg width={size} height={size} viewBox="0 0 24 24">{renderIcon(name, s)}</Svg>;
}

type SP = typeof S & { stroke: string };

function renderIcon(name: IconName, s: SP) {
  switch (name) {
    case 'map-pin': return <><Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" {...s} /><Circle cx={12} cy={10} r={3} {...s} /></>;
    case 'crosshair': return <><Circle cx={12} cy={12} r={10} {...s} /><Line x1={22} x2={18} y1={12} y2={12} {...s} /><Line x1={6} x2={2} y1={12} y2={12} {...s} /><Line x1={12} x2={12} y1={6} y2={2} {...s} /><Line x1={12} x2={12} y1={22} y2={18} {...s} /></>;
    case 'target': return <><Circle cx={12} cy={12} r={10} {...s} /><Circle cx={12} cy={12} r={6} {...s} /><Circle cx={12} cy={12} r={2} {...s} /></>;
    case 'arrow-up': return <><Path d="m5 12 7-7 7 7" {...s} /><Path d="M12 19V5" {...s} /></>;
    case 'arrow-left': return <><Path d="m12 19-7-7 7-7" {...s} /><Path d="M19 12H5" {...s} /></>;
    case 'arrow-right': return <><Path d="M5 12h14" {...s} /><Path d="m12 5 7 7-7 7" {...s} /></>;
    case 'flag': return <Path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" {...s} />;
    case 'play': return <Path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" {...s} />;
    case 'pause': return <><Rect x={14} y={3} width={5} height={18} rx={1} {...s} /><Rect x={5} y={3} width={5} height={18} rx={1} {...s} /></>;
    case 'square': return <Rect width={18} height={18} x={3} y={3} rx={2} {...s} />;
    case 'arrow-left-right': return <><Path d="M8 3 4 7l4 4" {...s} /><Path d="M4 7h16" {...s} /><Path d="m16 21 4-4-4-4" {...s} /><Path d="M20 17H4" {...s} /></>;
    case 'x': return <><Path d="M18 6 6 18" {...s} /><Path d="m6 6 12 12" {...s} /></>;
    case 'satellite': return <><Path d="m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5" {...s} /><Path d="M16.5 7.5 19 5" {...s} /><Path d="m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5" {...s} /><Path d="M9 21a6 6 0 0 0-6-6" {...s} /><Path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z" {...s} /></>;
    case 'footprints': return <><Path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" {...s} /><Path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" {...s} /><Path d="M16 17h4" {...s} /><Path d="M4 13h4" {...s} /></>;
    case 'bed-double': return <><Path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" {...s} /><Path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" {...s} /><Path d="M12 4v6" {...s} /><Path d="M2 18h20" {...s} /></>;
    case 'briefcase': return <><Path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...s} /><Rect width={20} height={14} x={2} y={6} rx={2} {...s} /></>;
    case 'spray-can': return <><Path d="M3 3h.01" {...s} /><Path d="M7 5h.01" {...s} /><Path d="M11 7h.01" {...s} /><Path d="M3 7h.01" {...s} /><Path d="M7 9h.01" {...s} /><Path d="M3 11h.01" {...s} /><Rect width={4} height={4} x={15} y={5} {...s} /><Path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" {...s} /><Path d="m13 14 8-2" {...s} /><Path d="m13 19 8-2" {...s} /></>;
    case 'cooking-pot': return <><Path d="M2 12h20" {...s} /><Path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" {...s} /><Path d="m4 8 16-4" {...s} /><Path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" {...s} /></>;
    case 'cup-soda': return <><Path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" {...s} /><Path d="M5 8h14" {...s} /><Path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" {...s} /><Path d="m12 8 1-6h2" {...s} /></>;
    case 'washing-machine': return <><Path d="M3 6h3" {...s} /><Path d="M17 6h.01" {...s} /><Rect width={18} height={20} x={3} y={2} rx={2} {...s} /><Circle cx={12} cy={13} r={5} {...s} /><Path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" {...s} /></>;
    case 'hand': return <><Path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" {...s} /><Path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" {...s} /><Path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" {...s} /><Path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" {...s} /></>;
    case 'stairs': return <><Path d="M4 20h4v-4h4v-4h4V8h4" {...s} /><Path d="M20 8v12" {...s} /><Path d="M4 20h16" {...s} /></>;
    case 'book-open': return <><Path d="M12 5v16" {...s} /><Path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" {...s} /></>;
    case 'arrow-up-down': return <><Path d="m21 16-4 4-4-4" {...s} /><Path d="M17 20V4" {...s} /><Path d="m3 8 4-4 4 4" {...s} /><Path d="M7 4v16" {...s} /></>;
    case 'sofa': return <><Path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" {...s} /><Path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" {...s} /><Path d="M4 18v2" {...s} /><Path d="M20 18v2" {...s} /><Path d="M12 4v9" {...s} /></>;
    case 'door-open': return <><Path d="M10 21H2" {...s} /><Path d="M10 3H7a2 2 00-2 2v16" {...s} /><Path d="M14 12h.01" {...s} /><Path d="M19 21V5a2 2 00-1.675-1.974l-6.163-1.013A1 1 0010 3v18a1 1 001.124.992z" {...s} /><Path d="M22 21h-3" {...s} /></>;
    case 'sparkles': return <><Path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" {...s} /><Path d="M20 2v4" {...s} /><Path d="M22 4h-4" {...s} /><Circle cx={4} cy={20} r={2} {...s} /></>;
    case 'user': return <><Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...s} /><Circle cx={12} cy={7} r={4} {...s} /></>;
    case 'search': return <><Circle cx={11} cy={11} r={8} {...s} /><Line x1={21} y1={21} x2={16.65} y2={16.65} {...s} /></>;
    case 'log-in': return <><Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" {...s} /><Path d="M10 17l5-5-5-5" {...s} /><Line x1={15} y1={12} x2={3} y2={12} {...s} /></>;
    case 'log-out': return <><Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...s} /><Path d="M16 17l5-5-5-5" {...s} /><Line x1={21} y1={12} x2={9} y2={12} {...s} /></>;
    case 'compass': return <><Circle cx={12} cy={12} r={10} {...s} /><Path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" {...s} /></>;
    case 'layers': return <><Path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" {...s} /><Path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" {...s} /><Path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" {...s} /></>;
    case 'shield-check': return <><Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" {...s} /><Path d="m9 12 2 2 4-4" {...s} /></>;
    case 'chevron-right': return <Path d="m9 18 6-6-6-6" {...s} />;
    case 'map': return <><Path d="M14.1 2.2 9.9 4.3 4.2 2.1A1 1 0 0 0 3 3v15a1 1 0 0 0 .7.9l4.2 2.1 4.2-2.1 5.7 2.1a1 1 0 0 0 1.2-.9V5a1 1 0 0 0-.7-.9z" {...s} /><Line x1={9.9} y1={4.3} x2={9.9} y2={20.3} {...s} /><Line x1={14.1} y1={2.2} x2={14.1} y2={18.2} {...s} /></>;
    case 'globe': return <><Circle cx={12} cy={12} r={10} {...s} /><Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...s} /><Path d="M2 12h20" {...s} /></>;
    case 'building': return <><Rect width={16} height={20} x={4} y={2} rx={2} {...s} /><Path d="M9 22v-4h6v4" {...s} /><Path d="M8 6h.01" {...s} /><Path d="M16 6h.01" {...s} /><Path d="M8 10h.01" {...s} /><Path d="M16 10h.01" {...s} /><Path d="M8 14h.01" {...s} /><Path d="M16 14h.01" {...s} /></>;
    case 'accessibility': return <><Circle cx={16} cy={4} r={1} {...s} /><Path d="m18 19 1-7-6 1" {...s} /><Path d="m5 8 3-3 5.5 3-2.36 3.5" {...s} /><Path d="M4.24 14.5a5 5 0 0 0 6.88 6" {...s} /><Path d="M13.76 17.5a5 5 0 0 0-6.88-6" {...s} /></>;
    case 'navigation': return <Path d="m3 11 19-9-9 19-2-8-8-2z" {...s} />;
    case 'lock': return <><Rect width={18} height={11} x={3} y={11} rx={2} {...s} /><Path d="M7 11V7a5 5 0 0 1 10 0v4" {...s} /></>;
    case 'check': return <Path d="M20 6 9 17l-5-5" {...s} />;
    case 'graduation-cap': return <><Path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" {...s} /><Path d="M22 10v6" {...s} /><Path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" {...s} /></>;
    case 'eye': return <><Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" {...s} /><Circle cx={12} cy={12} r={3} {...s} /></>;
    case 'google': return <><Circle cx={12} cy={12} r={10} fill={s.stroke} /><Path d="M17.5 12.2c0-.4-.04-.8-.1-1.2H12v2.3h3.1c-.13.7-.54 1.3-1.14 1.7v1.4h1.8c1.1-1 1.74-2.5 1.74-4.2z" fill="#4285F4" /><Path d="M12 17.8c1.56 0 2.88-.52 3.84-1.4l-1.84-1.4c-.52.35-1.18.56-2 .56-1.53 0-2.83-1.03-3.3-2.42H6.8v1.46C7.76 16.48 9.7 17.8 12 17.8z" fill="#34A853" /><Path d="M8.7 13.14c-.12-.35-.19-.73-.19-1.14s.07-.79.19-1.14V9.4H6.8A5.94 5.94 0 0 0 6 12c0 1 .25 1.94.8 2.6l1.9-1.46z" fill="#FBBC05" /><Path d="M12 8.6c.85 0 1.62.29 2.22.87l1.67-1.67C14.87 6.86 13.56 6.2 12 6.2 9.7 6.2 7.76 7.52 6.8 9.4l1.9 1.46c.47-1.39 1.77-2.26 3.3-2.26z" fill="#EA4335" /></>;
    case 'plus': return <><Path d="M5 12h14" {...s} /><Path d="M12 5v14" {...s} /></>;
    case 'minus': return <Path d="M5 12h14" {...s} />;
    case 'locate': return <><Circle cx={12} cy={12} r={3} {...s} /><Path d="M12 2v3" {...s} /><Path d="M12 19v3" {...s} /><Path d="M2 12h3" {...s} /><Path d="M19 12h3" {...s} /></>;
  }
}
