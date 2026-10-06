/*
 * File: ZoomControls.jsx
 * Created: 2026-10-05 12:00 PM
 * Last Modified: 2026-10-06
 */

import React, { useRef, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { theme } from '../../theme';

const HOLD_DELAY = 250; // ms bago mag-start ang continuous zoom (dapat mas mahaba sa normal na tap)

/**
 * Returns { onPressIn, onPressOut, onPress } props.
 * Tap → fires onTap once. Hold → starts native-driven continuous zoom.
 */
function useRepeatPress(onTap, onHoldStart, onHoldEnd) {
  const timer = useRef(null);
  const held = useRef(false);
  const suppressTap = useRef(false); // para hindi mag-tap-zoom pagkatapos ng hold

  const clear = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onPressIn = useCallback(() => {
    clear();
    held.current = false;
    suppressTap.current = false;
    timer.current = setTimeout(() => {
      held.current = true;
      onHoldStart();
    }, HOLD_DELAY);
  }, [clear, onHoldStart]);

  const onPressOut = useCallback(() => {
    clear();
    if (held.current) {
      suppressTap.current = true; // kakainin ng onPress na kasunod
      onHoldEnd();
    }
    held.current = false;
  }, [clear, onHoldEnd]);

  const onPress = useCallback(() => {
    if (suppressTap.current) {
      suppressTap.current = false;
      return;
    }
    onTap();
  }, [onTap]);

  return { onPressIn, onPressOut, onPress };
}

function PlusIcon({ size = 20, color = theme.colors.ink }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MinusIcon({ size = 20, color = theme.colors.ink }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ResetIcon({ size = 20, color = theme.colors.ink }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function ZoomControls({ zoomableRef }) {
  const stop = useCallback(
    () => zoomableRef.current?.stopContinuousZoom(),
    [zoomableRef],
  );

  const plusTap = useCallback(() => zoomableRef.current?.zoomIn(), [zoomableRef]);
  const plusHold = useCallback(() => zoomableRef.current?.startContinuousZoom(1), [zoomableRef]);
  const minusTap = useCallback(() => zoomableRef.current?.zoomOut(), [zoomableRef]);
  const minusHold = useCallback(() => zoomableRef.current?.startContinuousZoom(-1), [zoomableRef]);

  const plusProps = useRepeatPress(plusTap, plusHold, stop);
  const minusProps = useRepeatPress(minusTap, minusHold, stop);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={styles.btn}
          {...plusProps}
          activeOpacity={0.7}
          accessibilityLabel="Zoom in"
          accessibilityRole="button"
        >
          <PlusIcon />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.btn}
          {...minusProps}
          activeOpacity={0.7}
          accessibilityLabel="Zoom out"
          accessibilityRole="button"
        >
          <MinusIcon />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.btn}
          onPress={() => zoomableRef.current?.resetZoom()}
          activeOpacity={0.7}
          accessibilityLabel="Reset zoom"
          accessibilityRole="button"
        >
          <ResetIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 16,
  },
  btnGroup: {
    backgroundColor: theme.colors.canvas,
    borderRadius: theme.radius.lg,
    ...theme.shadow.lifted,
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
    overflow: 'hidden',
  },
  btn: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.hairlineTertiary,
  },
});