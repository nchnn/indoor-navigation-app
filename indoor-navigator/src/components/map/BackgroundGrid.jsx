import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { theme } from '../../theme';

// Captured once when the module loads. Assumes the page loaded at 100% zoom.
const BASE_DPR = Platform.OS === 'web' ? window.devicePixelRatio || 1 : 1;

function useBrowserZoom() {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const update = () => setZoom((window.devicePixelRatio || 1) / BASE_DPR);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return zoom;
}

function buildGridPaths(w, h, step) {
  if (w <= 0 || h <= 0 || step <= 0) return { minor: '', major: '' };

  const minor = [];
  const major = [];
  for (let i = 0, x = 0; x <= w; i++, x = i * step) (i % 5 === 0 ? major : minor).push(`M${x} 0V${h}`);
  for (let i = 0, y = 0; y <= h; i++, y = i * step) (i % 5 === 0 ? major : minor).push(`M0 ${y}H${w}`);
  return { minor: minor.join(''), major: major.join('') };
}

function BackgroundGrid({ step = 30, variant = 'light', style, children }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const zoom = useBrowserZoom();

 
  const bgColor =  theme.colors.gridBackground;
  const lineColor = theme.colors.gridMinor;

  // Cancel out the browser zoom so cells stay the same size on screen
  const effectiveStep = step / zoom;
  const strokeWidth = 1 / zoom;

  const d = useMemo(
    () => buildGridPaths(size.width, size.height, effectiveStep),
    [size.width, size.height, effectiveStep]
  );

  const onLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {size.width > 0 && size.height > 0 && (
        <Svg style={[StyleSheet.absoluteFill, styles.noTouch]} width={size.width} height={size.height}>
          <Rect width={size.width} height={size.height} fill={bgColor} />
          <Path d={d.minor} stroke={lineColor} strokeWidth={strokeWidth} />
          <Path d={d.major} stroke={theme.colors.gridMajor} strokeWidth={strokeWidth * 1.5} />
        </Svg>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  noTouch: { pointerEvents: 'none' },
});

export default React.memo(BackgroundGrid);