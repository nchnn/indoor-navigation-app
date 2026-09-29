import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Polyline, Rect, Text } from 'react-native-svg';
import { FLOOR_H, FLOOR_W, LAYOUT, ROOM_RECTS, type FloorNode } from '../../data/old.dorm3F';
import { theme } from '../../theme';

export interface MapHandle {
  zoomIn(): void;
  zoomOut(): void;
  recenter(): void;
  resetNorth(): void;
  centerOn(x: number, y: number, targetScale?: number): void;
}

interface Props {
  nodes: FloorNode[];
  routeIds: string[];
  originId: string | null;
  destId: string | null;
  livePos: { x: number; y: number } | null;
  liveAccUnits?: number | null;
  following?: boolean;
  onManualPan?(): void;
  onNodePress(id: string): void;
  onRotationChange?(deg: number): void;
}

const DEFAULT_SCALE = 1.35;
const MIN_SCALE = 0.75;
const MAX_SCALE = 4.5;

const FloorPlanMap = forwardRef<MapHandle, Props>(function FloorPlanMap(
  {
    nodes,
    routeIds,
    originId,
    destId,
    livePos,
    liveAccUnits,
    following = false,
    onManualPan,
    onNodePress,
    onRotationChange,
  },
  ref,
) {
  const { width: winW, height: winH } = Dimensions.get('window');
  const [viewSize, setViewSize] = useState({ width: winW, height: winH });

  const scale = useSharedValue(DEFAULT_SCALE);
  const savedScale = useSharedValue(DEFAULT_SCALE);
  const tx = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const rotation = useSharedValue(0); // radians
  const savedRotation = useSharedValue(0);
  // View size mirrored to UI thread for drag-limit clamping.
  const viewW = useSharedValue(winW);
  const viewH = useSharedValue(winH);
  const savedFocalX = useSharedValue(0);
  const savedFocalY = useSharedValue(0);
  // Mirrors `following` prop on UI thread so pan start only crosses
  // the bridge when follow mode is actually on (avoids re-render hitch).
  const followingSV = useSharedValue(following);
  const PAN_PADDING = 60;

  useEffect(() => {
    viewW.value = viewSize.width;
    viewH.value = viewSize.height;
  }, [viewSize.width, viewSize.height, viewW, viewH]);

  useEffect(() => {
    followingSV.value = following;
  }, [following, followingSV]);

  const safeNodes = nodes ?? [];
  const safeRouteIds = routeIds ?? [];
  const byId = useMemo(() => new Map(safeNodes.map((n) => [n.id, n])), [safeNodes]);
  const userPos = livePos ?? (originId ? byId.get(originId) : null);

  const centerOnPos = useCallback(
    (pos: { x: number; y: number }, targetScale?: number, duration = 250) => {
      const sSvg = Math.min(viewSize.width / FLOOR_W, viewSize.height / FLOOR_H);
      if (!sSvg || !Number.isFinite(sSvg)) return;

      const s = targetScale ?? (Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1);
      const r = Number.isFinite(rotation.value) ? rotation.value : 0;

      const dx = (pos.x - FLOOR_W / 2) * sSvg;
      const dy = (pos.y - FLOOR_H / 2) * sSvg;
      const cosR = Math.cos(r);
      const sinR = Math.sin(r);
      const rotX = dx * cosR - dy * sinR;
      const rotY = dx * sinR + dy * cosR;

      const targetTx = -s * rotX;
      const targetTy = -s * rotY;

      // Drag limit: keep floor within view + padding.
      const limitX = Math.max(0, (viewSize.width * s - viewSize.width) / 2) + PAN_PADDING;
      const limitY = Math.max(0, (viewSize.height * s - viewSize.height) / 2) + PAN_PADDING;
      const clampedTx = Math.min(limitX, Math.max(-limitX, targetTx));
      const clampedTy = Math.min(limitY, Math.max(-limitY, targetTy));

      if (targetScale != null) {
        scale.value = withTiming(s, { duration });
      }
      tx.value = withTiming(clampedTx, { duration });
      ty.value = withTiming(clampedTy, { duration });
    },
    [viewSize.width, viewSize.height, scale, rotation, tx, ty],
  );

  const prevFollowing = useRef(false);
  useEffect(() => {
    if (!following) {
      prevFollowing.current = false;
      return;
    }
    const target = userPos ? { x: userPos.x, y: userPos.y } : { x: FLOOR_W / 2, y: FLOOR_H / 2 };

    if (!prevFollowing.current) {
      prevFollowing.current = true;
      const curScale = Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
      const zoom = Math.max(curScale, 1.6);
      centerOnPos(target, zoom, 300);
    } else {
      centerOnPos(target, undefined, 220);
    }
  }, [following, userPos?.x, userPos?.y, centerOnPos, scale]);

  useImperativeHandle(ref, () => ({
    zoomIn() {
      const current = Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
      const next = Math.min(MAX_SCALE, current * 1.3);
      scale.value = withTiming(next, { duration: 220 });
      // Keep pan in bounds after button zoom (center-anchored).
      const lx = Math.max(0, ((viewSize.width * next - viewSize.width) / 2) + PAN_PADDING);
      const ly = Math.max(0, ((viewSize.height * next - viewSize.height) / 2) + PAN_PADDING);
      tx.value = withTiming(Math.min(lx, Math.max(-lx, tx.value)), { duration: 220 });
      ty.value = withTiming(Math.min(ly, Math.max(-ly, ty.value)), { duration: 220 });
    },
    zoomOut() {
      const current = Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
      const next = Math.max(MIN_SCALE, current / 1.3);
      scale.value = withTiming(next, { duration: 220 });
      const lx = Math.max(0, ((viewSize.width * next - viewSize.width) / 2) + PAN_PADDING);
      const ly = Math.max(0, ((viewSize.height * next - viewSize.height) / 2) + PAN_PADDING);
      tx.value = withTiming(Math.min(lx, Math.max(-lx, tx.value)), { duration: 220 });
      ty.value = withTiming(Math.min(ly, Math.max(-ly, ty.value)), { duration: 220 });
    },
    recenter() {
      scale.value = withTiming(DEFAULT_SCALE, { duration: 300 });
      tx.value = withTiming(0, { duration: 300 });
      ty.value = withTiming(0, { duration: 300 });
    },
    resetNorth() {
      rotation.value = withTiming(0, { duration: 300 });
      onRotationChange?.(0);
    },
    centerOn(x: number, y: number, targetScale?: number) {
      centerOnPos({ x, y }, targetScale, 300);
    },
  }));

  const triggerManualPan = () => {
    onManualPan?.();
  };

  const pan = Gesture.Pan()
    .maxPointers(1)
    .minDistance(4)
    .onStart(() => {
      // Only cross the bridge when follow mode is on; otherwise pan
      // stays fully on UI thread with zero JS work (no press hitch).
      if (followingSV.value) {
        followingSV.value = false;
        if (onManualPan) {
          runOnJS(triggerManualPan)();
        }
      }
      savedTx.value = Number.isFinite(tx.value) ? tx.value : 0;
      savedTy.value = Number.isFinite(ty.value) ? ty.value : 0;
    })
    .onUpdate((e) => {
      if (Number.isFinite(e.translationX) && Number.isFinite(e.translationY)) {
        const s = Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
        const limitX = Math.max(0, ((viewW.value * s - viewW.value) / 2) + PAN_PADDING);
        const limitY = Math.max(0, ((viewH.value * s - viewH.value) / 2) + PAN_PADDING);
        const nextX = savedTx.value + e.translationX;
        const nextY = savedTy.value + e.translationY;
        tx.value = Math.min(limitX, Math.max(-limitX, nextX));
        ty.value = Math.min(limitY, Math.max(-limitY, nextY));
      }
    });

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      savedScale.value = Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
      savedTx.value = Number.isFinite(tx.value) ? tx.value : 0;
      savedTy.value = Number.isFinite(ty.value) ? ty.value : 0;
      savedFocalX.value = Number.isFinite(e.focalX) ? e.focalX : viewW.value / 2;
      savedFocalY.value = Number.isFinite(e.focalY) ? e.focalY : viewH.value / 2;
    })
    .onUpdate((e) => {
      if (Number.isFinite(e.scale) && e.scale > 0) {
        const raw = savedScale.value * e.scale;
        if (Number.isFinite(raw) && raw > 0) {
          const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
          const k = next / savedScale.value;
          const cx = viewW.value / 2;
          const cy = viewH.value / 2;
          const fx = Number.isFinite(e.focalX) ? e.focalX : cx;
          const fy = Number.isFinite(e.focalY) ? e.focalY : cy;
          // Keep content point under fingers stable, then follow finger drift.
          const anchorX = savedFocalX.value - cx - savedTx.value;
          const anchorY = savedFocalY.value - cy - savedTy.value;
          const unclampedX = fx - cx - anchorX * k;
          const unclampedY = fy - cy - anchorY * k;
          scale.value = next;
          const limitX = Math.max(0, ((viewW.value * next - viewW.value) / 2) + PAN_PADDING);
          const limitY = Math.max(0, ((viewH.value * next - viewH.value) / 2) + PAN_PADDING);
          tx.value = Math.min(limitX, Math.max(-limitX, unclampedX));
          ty.value = Math.min(limitY, Math.max(-limitY, unclampedY));
        }
      }
    });

  const handleRotationChange = (deg: number) => {
    onRotationChange?.(deg);
  };

  const rotate = Gesture.Rotation()
    .onStart(() => {
      savedRotation.value = Number.isFinite(rotation.value) ? rotation.value : 0;
    })
    .onUpdate((e) => {
      if (Number.isFinite(e.rotation)) {
        rotation.value = savedRotation.value + e.rotation;
      }
    })
    .onEnd(() => {
      if (onRotationChange) {
        const deg = ((rotation.value * 180) / Math.PI) % 360;
        runOnJS(handleRotationChange)(deg);
      }
    });

  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  const animStyle = useAnimatedStyle(() => {
    const s = Number.isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
    const x = Number.isFinite(tx.value) ? tx.value : 0;
    const y = Number.isFinite(ty.value) ? ty.value : 0;
    const r = Number.isFinite(rotation.value) ? rotation.value : 0;
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: s },
        { rotate: `${r}rad` },
      ],
    };
  });

  const routePts = safeRouteIds
    .map((id) => byId.get(id))
    .filter((n): n is FloorNode => !!n)
    .map((n) => `${n.x},${n.y}`)
    .join(' ');

  const isOnRoute = new Set(safeRouteIds);

  const nodeFill = (n: FloorNode): string => {
    if (n.id === originId) return theme.colors.success;
    if (n.id === destId) return theme.colors.primary;
    switch (n.type) {
      case 'room':
        return theme.colors.canvas;
      case 'facility':
        return theme.colors.primarySoft;
      case 'corner':
        return theme.colors.primary;
      case 'stairs':
      case 'elevator':
      case 'exit':
        return theme.colors.ink;
      default:
        return theme.colors.hairlineStrong;
    }
  };

  const nodeStroke = (n: FloorNode): string => {
    if (n.id === originId || n.id === destId) return theme.colors.canvas;
    if (n.type === 'room') return theme.colors.primary;
    if (n.type === 'facility') return theme.colors.primary;
    if (n.type === 'corner') return theme.colors.primaryFocus;
    return theme.colors.canvas;
  };

  const r = (n: FloorNode): number => {
    if (n.id === originId || n.id === destId) return 13;
    if (n.type === 'room') return 9;
    if (n.type === 'facility') return 11;
    if (n.type === 'corner') return 10;
    if (n.type === 'stairs' || n.type === 'elevator' || n.type === 'exit') return 11;
    return 5;
  };

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && height > 0) {
          setViewSize((prev) =>
            prev.width === width && prev.height === height ? prev : { width, height },
          );
        }
      }}
    >
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.canvas, animStyle]}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${FLOOR_W} ${FLOOR_H}`}>
            {/* floor slab */}
            <Rect x={LAYOUT?.slab?.x ?? 15} y={LAYOUT?.slab?.y ?? 15} width={LAYOUT?.slab?.w ?? 970} height={LAYOUT?.slab?.h ?? 590} rx={18} fill={theme.colors.canvas} stroke={theme.colors.hairlineStrong} strokeWidth={3} />
            {/* vertical lobby */}
            <Rect x={LAYOUT?.lobby?.x ?? 445} y={LAYOUT?.lobby?.y ?? 35} width={LAYOUT?.lobby?.w ?? 110} height={LAYOUT?.lobby?.h ?? 550} rx={8} fill={theme.colors.hallway} />
            {/* horizontal hallway */}
            <Rect x={LAYOUT?.hallway?.x ?? 68} y={LAYOUT?.hallway?.y ?? 265} width={LAYOUT?.hallway?.w ?? 864} height={LAYOUT?.hallway?.h ?? 90} rx={8} fill={theme.colors.hallway} />
            {/* hallway center dashes */}
            <Line x1={(LAYOUT?.hallway?.x ?? 68) + 4} y1={LAYOUT?.hallway?.centerY ?? 310} x2={(LAYOUT?.hallway?.x ?? 68) + (LAYOUT?.hallway?.w ?? 864) - 4} y2={LAYOUT?.hallway?.centerY ?? 310} stroke={theme.colors.hairlineStrong} strokeWidth={2.5} strokeDasharray={[10, 8]} />
            <Line x1={LAYOUT?.lobby?.centerX ?? 500} y1={(LAYOUT?.lobby?.y ?? 35) + 5} x2={LAYOUT?.lobby?.centerX ?? 500} y2={(LAYOUT?.lobby?.y ?? 35) + (LAYOUT?.lobby?.h ?? 550) - 5} stroke={theme.colors.hairlineStrong} strokeWidth={2.5} strokeDasharray={[10, 8]} />

            {/* rooms & facilities - clickable rooms */}
            {(ROOM_RECTS ?? []).map((rm) => {
              const isOrigin = rm.id === originId;
              const isDest = rm.id === destId;
              const isSelected = isOrigin || isDest;
              const isFacility = rm.kind === 'facility-room';
              const isCirc = rm.kind === 'circulation-room';

              const fill = isOrigin
                ? theme.colors.successSoft
                : isDest
                  ? theme.colors.primarySoft
                  : isFacility
                    ? theme.colors.surface1
                    : isCirc
                      ? theme.colors.surface2
                      : theme.colors.roomFill;

              const stroke = isOrigin
                ? theme.colors.success
                : isDest
                  ? theme.colors.primary
                  : isFacility || isCirc
                    ? theme.colors.hairline
                    : theme.colors.roomBorder;

              const headerFill = isOrigin
                ? theme.colors.successSoft
                : isDest
                  ? theme.colors.primarySoft
                  : theme.colors.surface1;

              const headerTextColor = isOrigin
                ? theme.colors.success
                : isDest
                  ? theme.colors.primaryFocus
                  : theme.colors.ink;

              const isNorth = rm.y < 300;
              const isWestStair = rm.id === 'stair-a';
              const isEastStair = rm.id === 'stair-b';

              return (
                <G key={rm.id} onPress={() => onNodePress(rm.id)}>
                  <Rect
                    x={rm.x}
                    y={rm.y}
                    width={rm.w}
                    height={rm.h}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3.5 : 2.5}
                    onPress={() => onNodePress(rm.id)}
                  />
                  {!isCirc && (
                    <>
                      <Rect x={rm.x} y={rm.y} width={rm.w} height={28} rx={8} fill={headerFill} />
                      <Rect x={rm.x} y={rm.y + 18} width={rm.w} height={10} fill={headerFill} stroke="none" />
                    </>
                  )}
                  {rm.icon && (
                    <Text
                      x={rm.x + rm.w / 2}
                      y={rm.y + (isCirc ? 38 : 64)}
                      fontSize={isCirc ? 20 : 22}
                      textAnchor="middle"
                    >
                      {rm.icon}
                    </Text>
                  )}
                  <Text
                    x={rm.x + rm.w / 2}
                    y={rm.y + (isCirc ? 58 : 19)}
                    fontSize={rm.label.length > 7 ? 13 : 15.5}
                    fontWeight="800"
                    fill={headerTextColor}
                    textAnchor="middle"
                  >
                    {rm.label}
                  </Text>
                  <Text
                    x={rm.x + rm.w / 2}
                    y={rm.y + (isCirc ? 74 : (rm.icon ? 90 : 54))}
                    fontSize={11.5}
                    fontWeight="600"
                    fill={theme.colors.inkMuted}
                    textAnchor="middle"
                  >
                    {rm.sub}
                  </Text>
                  {!isWestStair && !isEastStair && (
                    <Rect
                      x={rm.x + rm.w / 2 - 14}
                      y={isNorth ? rm.y + rm.h - 4 : rm.y - 2}
                      width={28}
                      height={6}
                      rx={3}
                      fill={isSelected ? (isOrigin ? theme.colors.success : theme.colors.primary) : theme.colors.primary}
                    />
                  )}
                  {isWestStair && (
                    <Rect
                      x={rm.x + rm.w - 3}
                      y={rm.y + rm.h / 2 - 14}
                      width={6}
                      height={28}
                      rx={3}
                      fill={theme.colors.primary}
                    />
                  )}
                  {isEastStair && (
                    <Rect
                      x={rm.x - 3}
                      y={rm.y + rm.h / 2 - 14}
                      width={6}
                      height={28}
                      rx={3}
                      fill={theme.colors.primary}
                    />
                  )}
                </G>
              );
            })}

            {/* lobby labels */}
            <Text x={500} y={30} fontSize={13} fontWeight="800" fill={theme.colors.primaryFocus} textAnchor="middle">
              3F CENTRAL CORE · LIFT & STUDY
            </Text>
            <Text x={500} y={530} fontSize={13} fontWeight="800" fill={theme.colors.primaryFocus} textAnchor="middle">
              LOUNGE & COMMONS
            </Text>
            <Text x={500} y={584} fontSize={12} fontWeight="700" fill={theme.colors.inkMuted} textAnchor="middle">
              3RD FLOOR · RESIDENCE HALL
            </Text>

            {/* route glow + line */}
            {routePts.length > 0 && (
              <G>
                <Polyline
                  points={routePts}
                  fill="none"
                  stroke={theme.colors.primaryGlow}
                  strokeWidth={13}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Polyline
                  points={routePts}
                  fill="none"
                  stroke={theme.colors.primary}
                  strokeWidth={5.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={[14, 9]}
                />
              </G>
            )}

            {/* checkpoints */}
            {safeNodes.map((n) => (
              <G key={n.id}>
                <Circle
                  cx={n.x}
                  cy={n.y}
                  r={r(n) + 10}
                  fill="transparent"
                  onPress={() => onNodePress(n.id)}
                />
                {isOnRoute.has(n.id) && n.id !== originId && n.id !== destId && (
                  <Circle cx={n.x} cy={n.y} r={r(n) + 4} fill="none" stroke={theme.colors.primary} strokeWidth={2} opacity={0.55} />
                )}
                <Circle
                  cx={n.x}
                  cy={n.y}
                  r={r(n)}
                  fill={nodeFill(n)}
                  stroke={nodeStroke(n)}
                  strokeWidth={n.type === 'hallway' ? 1.5 : 2.5}
                  onPress={() => onNodePress(n.id)}
                />
                {(n.type === 'facility' ||
                  n.type === 'corner' ||
                  n.type === 'stairs' ||
                  n.type === 'elevator' ||
                  n.type === 'exit' ||
                  n.id === originId ||
                  n.id === destId) && (
                  <Text
                    x={n.x}
                    y={n.y - r(n) - 6}
                    fontSize={13.5}
                    fontWeight="800"
                    fill={n.id === destId ? theme.colors.primaryFocus : theme.colors.ink}
                    textAnchor="middle"
                  >
                    {n.short}
                  </Text>
                )}
                {(n.type === 'room' || n.id === originId) && (
                  <Text
                    x={n.x}
                    y={n.y + 3.5}
                    fontSize={10.5}
                    fontWeight="800"
                    fill={n.id === originId ? theme.colors.canvas : theme.colors.primaryFocus}
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {n.short}
                  </Text>
                )}
              </G>
            ))}

            {/* live dot (simulated real-time tracking) */}
            {livePos && (
              <G>
                {liveAccUnits != null && liveAccUnits > 4 && (
                  <Circle cx={livePos.x} cy={livePos.y} r={Math.min(90, liveAccUnits)} fill={theme.colors.primary} opacity={0.1} />
                )}
                <Circle cx={livePos.x} cy={livePos.y} r={16} fill={theme.colors.primary} opacity={0.22} />
                <Circle cx={livePos.x} cy={livePos.y} r={10} fill={theme.colors.primary} stroke={theme.colors.canvas} strokeWidth={3.5} />
                <Circle cx={livePos.x} cy={livePos.y} r={3.5} fill={theme.colors.canvas} />
              </G>
            )}
          </Svg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', backgroundColor: theme.colors.surface1 },
  canvas: { flex: 1 },
});

export default FloorPlanMap;

