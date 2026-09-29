import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { theme } from '../../theme';

export interface BackgroundGridProps {
  /** Optional minor grid step in pixels (default: 25) */
  minorStep?: number;
  /** Optional major grid step in pixels (default: 100) */
  majorStep?: number;
  /** Palette variant: standard light architectural grid or dark blueprint grid */
  variant?: 'light' | 'blueprint';
  /** Optional custom container style */
  style?: StyleProp<ViewStyle>;
  /** Optional children rendered on top of the grid layer */
  children?: React.ReactNode;
}

function buildGridPaths(w: number, h: number, minorStep: number, majorStep: number) {
  if (w <= 0 || h <= 0) return { minor: '', major: '' };

  let minor = '';
  let major = '';

  for (let x = 0; x <= w; x += minorStep) {
    if (x % majorStep === 0) {
      major += `M ${x} 0 L ${x} ${h} `;
    } else {
      minor += `M ${x} 0 L ${x} ${h} `;
    }
  }

  for (let y = 0; y <= h; y += minorStep) {
    if (y % majorStep === 0) {
      major += `M 0 ${y} L ${w} ${y} `;
    } else {
      minor += `M 0 ${y} L ${w} ${y} `;
    }
  }

  return { minor, major };
}

export default function BackgroundGrid({
  minorStep = 25,
  majorStep = 1000,
  variant = 'light',
  style,
  children,
}: BackgroundGridProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const isBlueprint = variant === 'blueprint';
  const bgColor = isBlueprint ? theme.colors.gridDarkBackground : theme.colors.gridBackground;
  const minorColor = isBlueprint ? theme.colors.gridDarkMinor : theme.colors.gridMinor;
  const majorColor = isBlueprint ? theme.colors.gridDarkMajor : theme.colors.gridMajor;

  const paths = useMemo(() => {
    return buildGridPaths(size.width, size.height, minorStep, majorStep);
  }, [size.width, size.height, minorStep, majorStep]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height }
      );
    }
  };

  return (
    <View style={[styles.container, style]} onLayout={onLayout} pointerEvents={children ? 'auto' : 'none'}>
      {size.width > 0 && size.height > 0 && (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
          {/* Base background fill */}
          <Rect x={0} y={0} width="100%" height="100%" fill={bgColor} />
          {/* Minor hairline grid */}
          <Path d={paths.minor} stroke={minorColor} strokeWidth={1} />
          {/* Major structural grid */}
          <Path d={paths.major} stroke={majorColor} strokeWidth={1.5} />
        </Svg>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
