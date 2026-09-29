// ─── RoomCell — architectural room with 2 corner door swings + center threshold
// Geometry drawn for door-side = bottom, then rotated via `facing`.
// Label counter-rotated so it stays upright regardless of facing.

import React from 'react';
import { G, Path, Rect, Text } from 'react-native-svg';
import { theme } from '../../theme';

export type RoomCellVariant = 'default' | 'origin' | 'destination';
export type RoomFacing = 'top' | 'bottom' | 'left' | 'right';

export interface RoomCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  sub?: string;
  facing?: RoomFacing;
  variant?: RoomCellVariant;
  active?: boolean;
  wallThickness?: number;
  doorWidth?: number;
  showDoorSwings?: boolean;
  onPress?: () => void;
}

export default function RoomCell({
  x = 0, y = 0, width = 240, height = 150,
  label = 'M109', sub, facing = 'bottom',
  variant = 'default', active = true,
  wallThickness, doorWidth, showDoorSwings = true, onPress,
}: RoomCellProps) {
  const isOrigin = variant === 'origin';
  const isDest = variant === 'destination';
  const selected = active || isOrigin || isDest;
  const wallT = wallThickness ?? Math.min(9, Math.max(4.5, Math.min(width, height) * 0.055));

  const wall = isOrigin ? theme.colors.success : isDest || active ? theme.colors.primary : theme.colors.ink;
  const detail = isOrigin ? theme.colors.success : isDest || active ? theme.colors.primaryFocus : theme.colors.roomBorder;
  const annotation = isOrigin ? theme.colors.success : isDest || active ? theme.colors.primaryFocus : theme.colors.inkSubtle;
  const bodyFill = isOrigin ? theme.colors.successSoft : isDest ? theme.colors.primarySoft : theme.colors.canvas;
  const labelColor = isOrigin ? theme.colors.success : isDest || active ? theme.colors.primaryFocus : theme.colors.ink;
  const thresholdColor = isOrigin ? theme.colors.success : theme.colors.primary;

  // ── all geometry uses "door-side = bottom" convention ──
  // top wall: two corner gaps for swing doors
  const topGapW = Math.min(width * 0.2, 56);
  const topMidX = wallT + topGapW;
  const topMidW = Math.max(0, width - wallT * 2 - topGapW * 2);

  // bottom wall: center threshold gap
  const botGapW = Math.max(12, Math.min(doorWidth ?? width * 0.28, width - wallT * 2 - 4));
  const botGapLeft = width / 2 - botGapW / 2;
  const botGapRight = width / 2 + botGapW / 2;
  const botSegL = Math.max(0, botGapLeft);
  const botSegR = Math.max(0, width - botGapRight);

  // swing arc radius = top gap width
  const swingR = topGapW;

  // hinge positions (local coords, door-side = bottom)
  const hingeL = { x: wallT, y: wallT };
  const hingeR = { x: width - wallT, y: wallT };

  // ── facing rotation ──
  // Structural group rotated so door-side faces the chosen wall.
  // bottom=0°, left=90°, top=180°, right=270°
  const facingDeg = { bottom: 0, left: 90, top: 180, right: 270 } as const;
  const deg = facingDeg[facing];
  const cx = width / 2;
  const cy = height / 2;
  const structRotate = deg === 0 ? undefined : `rotate(${deg}, ${cx}, ${cy})`;
  // Counter-rotate label so text stays upright
  const labelRotate = deg === 0 ? undefined : `rotate(${-deg}, ${cx}, ${cy})`;

  const fontSize = Math.min(30, Math.max(16, width * 0.13));
  const subSize = Math.min(12, fontSize * 0.5);

  return (
    <G x={x} y={y} onPress={onPress}>
      {/* selection halo */}
      {selected && (
        <Rect x={-wallT} y={-wallT} width={width + wallT * 2} height={height + wallT * 2}
          rx={8} fill="none" stroke={isOrigin ? theme.colors.success : theme.colors.primaryGlow}
          strokeWidth={wallT + 4} opacity={0.9} />
      )}

      {/* body fill */}
      <Rect x={0} y={0} width={width} height={height} rx={4} fill={bodyFill} />

      {/* ── structural group (rotated by facing) ── */}
      <G transform={structRotate}>
        {/* inner hairline */}
        <Rect x={wallT + 2.5} y={wallT + 2.5}
          width={Math.max(0, width - (wallT + 2.5) * 2)}
          height={Math.max(0, height - (wallT + 2.5) * 2)}
          rx={2} fill="none" stroke={detail} strokeWidth={1.2} opacity={0.85} />

        {/* side walls (full height) */}
        <Rect x={0} y={0} width={wallT} height={height} fill={wall} />
        <Rect x={width - wallT} y={0} width={wallT} height={height} fill={wall} />
        {/* top wall: middle segment, corner gaps for swing doors */}
        {topMidW > 0 && <Rect x={topMidX} y={0} width={topMidW} height={wallT} fill={wall} />}
        {/* bottom wall: two segments around center door */}
        {botSegL > 0 && <Rect x={0} y={height - wallT} width={botSegL} height={wallT} fill={wall} />}
        {botSegR > 0 && <Rect x={botGapRight} y={height - wallT} width={botSegR} height={wallT} fill={wall} />}

        {/* door swings (two quarter-arcs at top corners) */}
        {showDoorSwings && swingR > 4 && (
          <>
            <Path d={`M ${hingeL.x + swingR} ${hingeL.y} L ${hingeL.x} ${hingeL.y}`}
              stroke={annotation} strokeWidth={1.5} />
            <Path d={`M ${hingeL.x + swingR} ${hingeL.y} A ${swingR} ${swingR} 0 0 0 ${hingeL.x} ${hingeL.y + swingR}`}
              fill="none" stroke={annotation} strokeWidth={1.5} strokeLinecap="round" />

            <Path d={`M ${hingeR.x - swingR} ${hingeR.y} L ${hingeR.x} ${hingeR.y}`}
              stroke={annotation} strokeWidth={1.5} />
            <Path d={`M ${hingeR.x - swingR} ${hingeR.y} A ${swingR} ${swingR} 0 0 1 ${hingeR.x} ${hingeR.y + swingR}`}
              fill="none" stroke={annotation} strokeWidth={1.5} strokeLinecap="round" />

            <Rect x={hingeL.x - 2} y={hingeL.y - 2} width={4} height={4} rx={2} fill={wall} />
            <Rect x={hingeR.x - 2} y={hingeR.y - 2} width={4} height={4} rx={2} fill={wall} />
          </>
        )}

        {/* bottom threshold pill */}
        <Rect x={botGapLeft} y={height - wallT} width={botGapW} height={wallT}
          rx={wallT / 2} fill={thresholdColor} />
      </G>

      {/* ── label (counter-rotated to stay upright) ── */}
      <G transform={labelRotate}>
        <Text x={cx} y={cy + (sub ? fontSize * 0.1 : fontSize * 0.35)}
          fontSize={fontSize} fontWeight="800" letterSpacing={1.5}
          fill={labelColor} textAnchor="middle">
          {label}
        </Text>
        {sub ? (
          <Text x={cx} y={cy + fontSize * 0.35 + 16}
            fontSize={subSize} fontWeight="700" letterSpacing={2}
            fill={theme.colors.inkMuted} textAnchor="middle">
            {sub.toUpperCase()}
          </Text>
        ) : null}
      </G>

      {/* hit area */}
      <Rect x={-6} y={-6} width={width + 12} height={height + 12} fill="transparent" onPress={onPress} />
    </G>
  );
}
