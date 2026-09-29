// ─── DoubleFlightStairs — plan-view stair symbol for FloorPlanMap ─────────────
// Matches Image 1 "Double-Flight Stairs": U-shaped, Up flight left, Down flight
// right, half-landing on top, architectural break line on down flight.
// Custom text is rendered below the symbol via `title` prop.

import React from 'react';
import { G, Line, Path, Rect, Text } from 'react-native-svg';
import { theme } from '../../theme';

export interface DoubleFlightStairsProps {
  /** Top-left origin in FloorPlanMap units. Defaults to 0,0 for standalone use. */
  x?: number;
  y?: number;
  /** Symbol size. Defaults tuned for mobile legibility inside FloorPlanMap. */
  width?: number;
  height?: number;
  /** Flight labels. Defaults match evacuation-plan convention. */
  upLabel?: string;
  downLabel?: string;
  /** Custom text below symbol, e.g. room code or level link. */
  title?: string;
  /** Hide the title row when used as a compact marker. */
  showTitle?: boolean;
  /** Highlights the symbol when it is origin/destination. */
  active?: boolean;
  onPress?: () => void;
}

export default function DoubleFlightStairs({
  x = 0,
  y = 0,
  width = 96,
  height = 132,
  upLabel = 'Up',
  downLabel = 'Down',
  title = 'Double-Flight Stairs',
  showTitle = true,
  active = false,
  onPress,
}: DoubleFlightStairsProps) {
  const wall = theme.colors.roomBorder;
  const tread = theme.colors.hairline;
  const landingFill = theme.colors.surface2;
  const arrow = theme.colors.ink;
  const accent = active ? theme.colors.primary : theme.colors.ink;

  const flightW = width * 0.38;
  const gapW = width * 0.24;
  const landingH = height * 0.22;
  const flightH = height - landingH;

  const leftX = 0;
  const midX = flightW;
  const rightX = flightW + gapW;

  const steps = 6;
  const stepGap = flightH / steps;

  return (
    <G x={x} y={y} onPress={onPress}>
      {/* outer wall */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={4}
        fill={theme.colors.roomFill}
        stroke={active ? theme.colors.primary : wall}
        strokeWidth={active ? 3 : 2}
      />
      {/* top landing */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={landingH}
        fill={landingFill}
        stroke={wall}
        strokeWidth={1.5}
      />
      {/* stair well gap */}
      <Rect
        x={midX}
        y={landingH}
        width={gapW}
        height={flightH}
        fill={theme.colors.canvas}
        stroke={tread}
        strokeWidth={1}
      />
      {/* treads left flight (Up) */}
      {Array.from({ length: steps }).map((_, i) => (
        <Line
          key={`l-${i}`}
          x1={leftX}
          y1={landingH + (i + 1) * stepGap}
          x2={leftX + flightW}
          y2={landingH + (i + 1) * stepGap}
          stroke={tread}
          strokeWidth={1.5}
        />
      ))}
      {/* treads right flight (Down) */}
      {Array.from({ length: steps }).map((_, i) => (
        <Line
          key={`r-${i}`}
          x1={rightX}
          y1={landingH + (i + 1) * stepGap}
          x2={rightX + flightW}
          y2={landingH + (i + 1) * stepGap}
          stroke={tread}
          strokeWidth={1.5}
        />
      ))}
      {/* Up path: bottom-left -> landing -> right */}
      <Path
        d={`M ${leftX + flightW / 2} ${height - 6} L ${leftX + flightW / 2} ${landingH / 2} L ${rightX + flightW / 2} ${landingH / 2} L ${rightX + flightW / 2} ${landingH + 22}`}
        fill="none"
        stroke={arrow}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Down entry: bottom-right going up */}
      <Path
        d={`M ${rightX + flightW / 2} ${height - 6} L ${rightX + flightW / 2} ${landingH + 28}`}
        fill="none"
        stroke={arrow}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* arrowheads */}
      <Path
        d={`M ${rightX + flightW / 2 - 5} ${landingH + 28} L ${rightX + flightW / 2} ${landingH + 20} L ${rightX + flightW / 2 + 5} ${landingH + 28} Z`}
        fill={arrow}
      />
      {/* architectural break on down flight */}
      <Path
        d={`M ${rightX + 4} ${landingH + 46} l 12 -8 l 12 8 l 12 -8 L ${rightX + flightW - 4} ${landingH + 58}`}
        fill="none"
        stroke={accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* side labels */}
      <Text x={-4} y={height + 2} fontSize={11} fontWeight="700" fill={arrow} textAnchor="end">
        {upLabel}
      </Text>
      <Text x={width + 4} y={height + 2} fontSize={11} fontWeight="700" fill={arrow}>
        {downLabel}
      </Text>
      {/* custom text */}
      {showTitle && (
        <Text
          x={width / 2}
          y={height + 18}
          fontSize={12}
          fontWeight="800"
          fill={active ? theme.colors.primaryFocus : theme.colors.ink}
          textAnchor="middle"
        >
          {title}
        </Text>
      )}
    </G>
  );
}
