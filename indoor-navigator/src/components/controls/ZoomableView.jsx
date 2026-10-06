/*
 * File: ZoomableView.jsx
 * Created: 2026-10-05 12:00 PM
 * Last Modified: 2026-10-06
 */

import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const ZOOM_FACTOR = 1.25; // kada tap: ×1.25 (in) o ÷1.25 (out) — pantay na feel kahit anong scale
const HOLD_ZOOM_SPEED = .3; // scale units per second
const DEFAULT_FRICTION = 21;
const IS_WEB = Platform.OS === 'web';

/**
 * Pinch-to-zoom + pan wrapper.
 * Exposes { zoomIn, zoomOut, startContinuousZoom, stopContinuousZoom, resetZoom } via ref.
 *
 * Transform model (origin = center ng inner view):
 *   screen = c0 + t + s * (p - c0)
 * kaya para manatili sa isang focal point f ang content habang nagbabago ang scale (r = s'/s):
 *   t' = f - c0 - r * (f - c0 - t)
 */
const ZoomableView = forwardRef(function ZoomableView(
  { style, children, friction = DEFAULT_FRICTION, onZoomChange, singleFingerPan = true },
  ref,
) {
  const containerRef = useRef(null);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Gesture bookkeeping
  const isPinching = useRef(false);
  const pinch = useRef(null);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  // JS-side mirrors (target/current values). Kailangan dahil stale ang __getValue() kapag native driver.
  const jsScale = useRef(1);
  const jsTx = useRef(0);
  const jsTy = useRef(0);

  // Measured boxes
  const viewportRef = useRef({ w: 0, h: 0 });
  const viewportPage = useRef({ x: 0, y: 0 }); // posisyon ng viewport sa screen (para sa pinch focal point)
  const contentRef = useRef({ w: 0, h: 0 });

  // Forward live zoom value to parent (rounded + deduped)
  const onZoomRef = useRef(onZoomChange);
  onZoomRef.current = onZoomChange;
  const lastNotified = useRef(1);
  useEffect(() => {
    const id = scale.addListener(({ value }) => {
      const rounded = Math.round(value * 20) / 20;
      if (Math.abs(lastNotified.current - rounded) > 0.001) {
        lastNotified.current = rounded;
        onZoomRef.current?.(rounded);
      }
    });
    return () => scale.removeListener(id);
  }, [scale]);

  // Bagong translate para manatili sa (fx, fy) [viewport coords] ang content point habang nag-scale ng ratio r.
  const anchoredTranslate = (fx, fy, r, tx, ty) => {
    const { w: cw, h: ch } = contentRef.current;
    if (cw <= 0 || ch <= 0) return { x: tx, y: ty };
    return {
      x: fx - cw / 2 - r * (fx - tx - cw / 2),
      y: fy - ch / 2 - r * (fy - ty - ch / 2),
    };
  };

  // Centered translate: gitna ng content nasa gitna ng viewport.
  // Scale-independent (content center laging nasa c0 + t). Gamit sa full zoom-out.
  const centeredTranslate = () => {
    const { w: vw, h: vh } = viewportRef.current;
    const { w: cw, h: ch } = contentRef.current;
    if (vw <= 0 || vh <= 0 || cw <= 0 || ch <= 0) return null;
    return { x: vw / 2 - cw / 2, y: vh / 2 - ch / 2 };
  };

  // Dynamic min: sakop lahat ng WIDTH ng floor plan pag max zoom-out.
  // fit = viewportWidth / contentWidth (max 1; fallback static MIN_SCALE).
  const getMinScale = () => {
    const { w: vw } = viewportRef.current;
    const { w: cw } = contentRef.current;
    if (vw > 0 && cw > 0) return Math.min(vw / cw, 1);
    return MIN_SCALE;
  };
  const clampScaleDyn = (s) => Math.min(MAX_SCALE, Math.max(getMinScale(), s));

  const dist = (t) => {
    const dx = t[0].pageX - t[1].pageX;
    const dy = t[0].pageY - t[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const midpoint = (t) => ({
    x: (t[0].pageX + t[1].pageX) / 2 - viewportPage.current.x,
    y: (t[0].pageY + t[1].pageY) / 2 - viewportPage.current.y,
  });

  // ── Hold (continuous) zoom ──
  const holdAnim = useRef(null);
  const holdInfo = useRef(null);

  const stopContinuousZoom = useCallback(() => {
    const info = holdInfo.current;
    if (!holdAnim.current || !info) return;
    holdAnim.current.stop();
    holdAnim.current = null;
    holdInfo.current = null;

    // Linear easing → scale at translate ay linear din sa oras,
    // kaya kayang kalkulahin ang eksaktong estado nang hindi bumabasa ng native value.
    const f = Math.min(1, Math.max(0, (Date.now() - info.start) / info.duration));
    const s = info.s0 + (info.s1 - info.s0) * f;
    const tx = info.tx0 + (info.tx1 - info.tx0) * f;
    const ty = info.ty0 + (info.ty1 - info.ty0) * f;
    jsScale.current = s;
    jsTx.current = tx;
    jsTy.current = ty;
    scale.setValue(s);
    translateX.setValue(tx);
    translateY.setValue(ty);
  }, [scale, translateX, translateY]);

  const startContinuousZoom = useCallback(
    (direction) => {
      stopContinuousZoom();

      const s0 = jsScale.current;
      const dynMin = getMinScale();
      const s1 = direction > 0 ? MAX_SCALE : dynMin;
      const duration = (Math.abs(s1 - s0) / HOLD_ZOOM_SPEED) * 1000;
      if (duration <= 0) return;

      const tx0 = jsTx.current;
      const ty0 = jsTy.current;
      const { w: vw, h: vh } = viewportRef.current;
      let a = anchoredTranslate(vw / 2, vh / 2, s1 / s0, tx0, ty0);
      // Full zoom-out → isentro ang buong floor plan sa screen
      if (s1 <= dynMin + 0.0001) {
        const c = centeredTranslate();
        if (c) a = c;
      }

      holdInfo.current = { start: Date.now(), duration, s0, s1, tx0, ty0, tx1: a.x, ty1: a.y };
      holdAnim.current = Animated.parallel([
        Animated.timing(scale, { toValue: s1, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: a.x, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: a.y, duration, easing: Easing.linear, useNativeDriver: true }),
      ]);
      holdAnim.current.start(({ finished }) => {
        if (finished) {
          // Umabot sa dulo: i-commit ang final state.
          jsScale.current = s1;
          jsTx.current = a.x;
          jsTy.current = a.y;
          holdAnim.current = null;
          holdInfo.current = null;
        }
      });
    },
    [scale, translateX, translateY, stopContinuousZoom],
  );

  // ── Tap zoom: center-anchored spring ──
  const zoomCentered = useCallback(
    (toValue) => {
      stopContinuousZoom();
      const s = jsScale.current;
      const dynMin = getMinScale();
      const clamped = clampScaleDyn(toValue);
      if (Math.abs(clamped - s) < 0.0001) return;

      const { w: vw, h: vh } = viewportRef.current;
      let a = anchoredTranslate(vw / 2, vh / 2, clamped / s, jsTx.current, jsTy.current);
      // Full zoom-out → isentro ang buong floor plan sa screen
      if (clamped <= dynMin + 0.0001) {
        const c = centeredTranslate();
        if (c) a = c;
      }
      jsScale.current = clamped;
      jsTx.current = a.x;
      jsTy.current = a.y;
      Animated.parallel([
        Animated.spring(scale, { toValue: clamped, friction, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: a.x, friction, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: a.y, friction, useNativeDriver: true }),
      ]).start();
    },
    [friction, scale, translateX, translateY, stopContinuousZoom],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (evt, gs) => {
          const touches = evt.nativeEvent.touches || [];
          // Pinch (2+ fingers) always pans/zooms the canvas.
          if (touches.length >= 2) return true;
          // In edit-select mode single-finger drags belong to rooms/handles,
          // so the canvas must not steal them. Drags on empty space still
          // reach the canvas because the floor slab never claims moves.
          // On desktop web, mouse drags that start outside rooms/grips pan.
          if (!singleFingerPan) {
            // Web: DOM check — suppress pan when drag starts on a grip/handle.
            if (IS_WEB) {
              const t = evt.nativeEvent.target;
              if (t && typeof t.closest === 'function' &&
                  t.closest('[data-grip]')) {
                return false;
              }
            }
            // Native: bubbling lets child handles (MoveHandle, ResizeHandle)
            // claim first; their onResponderTerminationRequest:()=>false
            // prevents stealing. Empty-space drags reach here → pan normally.
            return Math.abs(gs.dx) > 5 || Math.abs(gs.dy) > 5;
          }
          return Math.abs(gs.dx) > 5 || Math.abs(gs.dy) > 5;
        },
        onPanResponderGrant: () => {
          stopContinuousZoom();
          // refresh ng posisyon ng viewport sa screen
          containerRef.current?.measure((x, y, w, h, pageX, pageY) => {
            viewportPage.current = { x: pageX, y: pageY };
          });
          lastTranslateX.current = jsTx.current;
          lastTranslateY.current = jsTy.current;
          // setValue ay awtomatikong humihinto sa tumatakbong spring
          scale.setValue(jsScale.current);
          translateX.setValue(jsTx.current);
          translateY.setValue(jsTy.current);
        },
        onPanResponderMove: (evt, gs) => {
          const touches = evt.nativeEvent.touches || [];

          if (touches.length >= 2) {
            // ── Pinch (anchored sa midpoint ng dalawang daliri + two-finger pan) ──
            const d = dist(touches);
            const m = midpoint(touches);
            if (!isPinching.current) {
              isPinching.current = true;
              pinch.current = {
                d,
                mx: m.x,
                my: m.y,
                s: jsScale.current,
                tx: jsTx.current,
                ty: jsTy.current,
              };
            }
            const p = pinch.current;
            if (!p || p.d <= 0) return;
            const newScale = clampScaleDyn((p.s * d) / p.d);
            const a = anchoredTranslate(p.mx, p.my, newScale / p.s, p.tx, p.ty);
            let ntx = a.x + (m.x - p.mx);
            let nty = a.y + (m.y - p.my);
            // Pinch hanggang dulo → isentro ang buong floor plan
            if (newScale <= getMinScale() + 0.0001) {
              const c = centeredTranslate();
              if (c) {
                ntx = c.x;
                nty = c.y;
              }
            }
            scale.setValue(newScale);
            translateX.setValue(ntx);
            translateY.setValue(nty);
            jsScale.current = newScale;
            jsTx.current = ntx;
            jsTy.current = nty;
          } else if (!isPinching.current) {
            // ── Pan (isang daliri) ──
            const ntx = lastTranslateX.current + gs.dx;
            const nty = lastTranslateY.current + gs.dy;
            translateX.setValue(ntx);
            translateY.setValue(nty);
            jsTx.current = ntx;
            jsTy.current = nty;
          }
        },
        onPanResponderRelease: () => {
          isPinching.current = false;
          pinch.current = null;
        },
        onPanResponderTerminate: () => {
          isPinching.current = false;
          pinch.current = null;
        },
      }),
    [scale, translateX, translateY, stopContinuousZoom, singleFingerPan],
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomCentered(jsScale.current * ZOOM_FACTOR),
      zoomOut: () => zoomCentered(jsScale.current / ZOOM_FACTOR),
      startContinuousZoom,
      stopContinuousZoom,
      /** Returns the content-space point currently at viewport center. */
      getViewCenter: () => {
        const { w: vw, h: vh } = viewportRef.current;
        const { w: cw, h: ch } = contentRef.current;
        const s = jsScale.current;
        if (cw <= 0 || ch <= 0 || s <= 0) return { x: cw / 2, y: ch / 2 };
        return {
          x: (vw / 2 - cw / 2 - jsTx.current) / s + cw / 2,
          y: (vh / 2 - ch / 2 - jsTy.current) / s + ch / 2,
        };
      },
      /** Animate so content point (cx, cy) is centered on screen. */
      focusOn: (cx, cy, toScale) => {
        stopContinuousZoom();
        const s = toScale ?? jsScale.current;
        const { w: vw, h: vh } = viewportRef.current;
        const { w: cw, h: ch } = contentRef.current;
        if (cw <= 0 || ch <= 0) return;
        const tx = vw / 2 - cw / 2 - s * (cx - cw / 2);
        const ty = vh / 2 - ch / 2 - s * (cy - ch / 2);
        jsScale.current = s;
        jsTx.current = tx;
        jsTy.current = ty;
        Animated.parallel([
          Animated.spring(scale, { toValue: s, friction, useNativeDriver: true }),
          Animated.spring(translateX, { toValue: tx, friction, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: ty, friction, useNativeDriver: true }),
        ]).start();
      },
      resetZoom: () => {
        stopContinuousZoom();
        jsScale.current = 1;
        jsTx.current = 0;
        jsTy.current = 0;
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction, useNativeDriver: true }),
          Animated.spring(translateX, { toValue: 0, friction, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, friction, useNativeDriver: true }),
        ]).start();
      },
    }),
    [zoomCentered, startContinuousZoom, stopContinuousZoom, friction, scale, translateX, translateY],
  );

  return (
    <View
      ref={containerRef}
      style={[styles.container, style]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        viewportRef.current = { w: width, h: height };
        containerRef.current?.measure((x, y, w, h, pageX, pageY) => {
          viewportPage.current = { x: pageX, y: pageY };
        });
      }}
      {...panResponder.panHandlers}
    >
      <Animated.View
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          contentRef.current = { w: width, h: height };
        }}
        style={[
          styles.inner,
          {
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  // Viewport = screen (mapArea). Kailangan flex:1 para ang masukat na
  // viewport sa onLayout ay screen, hindi content — dito mag-center ang zoom.
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  // Sumunod sa laki ng content (FloorPlan 8000x6000), hindi sa laki ng container.
  // Importante ito para tama ang center/origin ng scale.
  inner: {
    alignSelf: 'flex-start',
  },
});

export default ZoomableView;