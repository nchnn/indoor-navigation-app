import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Svg, G, Rect, Circle, Path } from 'react-native-svg';
import Room from '../map/Room';
import { getDoorAnchor } from '../map/Door';
import OpenToBelow from '../map/OpenToBelow';
import ComfortRoom from '../map/ComfortRoom';
import Quadrangle from '../map/Quadrangle';
import DoubleFlightStairs from '../map/DoubleFlightStairs';
import { theme } from '../../theme';
import { FLOOR_W, FLOOR_H, SNAP, MIN_SIZE, snap, kindOf } from '../../services/floorPlanStore';

/**
 * Selection overlay — reference style:
 * thin dark dashed outline on the room edge, 8 small white squares
 * (4 corners + 4 edge-mids), no pink, no arrows, no center button.
 * All sizes stay constant on screen:
 * floorUnits = screenPx / scale.
 */
const SEL = '#111111';
const HANDLE_VIS = 12;
const HANDLE_HIT = 30;
const LINE_SCREEN = 1.5;
const screen = (px, scale) => px / Math.max(scale || 1, 0.3);
const IS_WEB = Platform.OS === 'web';

function pageOf(e) {
  const n = e?.nativeEvent ?? {};
  const pageX = n.pageX ?? n.clientX ?? null;
  const pageY = n.pageY ?? n.clientY ?? null;
  return { pageX, pageY };
}

function locationOf(e) {
  const n = e?.nativeEvent ?? {};
  const x = n.locationX ?? n.x ?? n.offsetX ?? null;
  const y = n.locationY ?? n.y ?? n.offsetY ?? null;
  if (typeof x === 'number' && typeof y === 'number') return { x, y };
  return null;
}


/**
 * Web drag sessions. react-native-svg on web only maps `onPress` to a DOM
 * click — RN responder props and `onPressIn` fall through to the DOM and are
 * ignored. So drags are driven from real DOM events (`onMouseDown` /
 * `onTouchStart`, which React always attaches) + window move/up listeners.
 * No-op on native, where responders are used instead.
 */
function webPoint(e) {
  const n = e?.nativeEvent ?? e ?? {};
  const t = (n.touches && n.touches[0]) || (n.changedTouches && n.changedTouches[0]);
  const x = t ? (t.pageX ?? t.clientX) : (n.pageX ?? n.clientX);
  const y = t ? (t.pageY ?? t.clientY) : (n.pageY ?? n.clientY);
  return x == null || y == null ? null : { x, y };
}

function useWebDrag({ scale, onDrag }) {
  const session = useRef(null);
  const movedRef = useRef(false);
  const live = useRef({ scale, onDrag });
  live.current = { scale, onDrag };

  // Unmount safety: tear down any in-flight window listeners.
  useEffect(() => () => {
    const st = session.current;
    session.current = null;
    st?.cleanup?.();
  }, []);

  const endSession = () => {
    const st = session.current;
    if (!st) return;
    session.current = null;
    st.cleanup?.();
  };

  // True once if the last session actually dragged (not a tap). Consumes
  // the flag so the following tap works normally. Used to swallow the
  // click the browser fires after a drag-release.
  const takeMoved = () => {
    const m = movedRef.current;
    movedRef.current = false;
    return m;
  };

  const fire = (px, py) => {
    const st = session.current;
    if (!st) return;
    if (Math.hypot(px - st.sx, py - st.sy) > 6) movedRef.current = true;
    const k = Math.max(live.current.scale || 1, 0.05);
    live.current.onDrag?.((px - st.sx) / k, (py - st.sy) / k, st.base);
  };

  const beginMouse = (e, base) => {
    if (!IS_WEB || typeof window === 'undefined') return;
    const p = webPoint(e);
    if (!p) return;
    endSession();
    movedRef.current = false;
    const handleMove = (ev) => {
      if (session.current?.pointer !== 'mouse') return;
      const q = webPoint(ev);
      if (q) fire(q.x, q.y);
    };
    const handleUp = () => { endSession(); };
    const cleanup = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('blur', handleUp);
    };
    session.current = { pointer: 'mouse', sx: p.x, sy: p.y, base, cleanup };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('blur', handleUp);
  };

  const beginTouch = (e, base) => {
    if (!IS_WEB || typeof window === 'undefined') return;
    const n = e?.nativeEvent ?? e ?? {};
    const t = n.touches?.[0] ?? n.changedTouches?.[0];
    if (!t || t.pageX == null || t.pageY == null) return;
    endSession();
    movedRef.current = false;
    const touchId = t.identifier;
    const handleMove = (ev) => {
      const st = session.current;
      if (!st || st.pointer !== 'touch') return;
      const list = ev.touches?.length ? ev.touches : ev.changedTouches;
      const one = [...(list || [])].find((x) => x.identifier === touchId) ?? list?.[0];
      if (!one || one.pageX == null || one.pageY == null) return;
      if (ev.cancelable) ev.preventDefault();
      fire(one.pageX, one.pageY);
    };
    const handleUp = () => { endSession(); };
    const cleanup = () => {
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('touchcancel', handleUp);
      window.removeEventListener('blur', handleUp);
    };
    session.current = { pointer: 'touch', sx: t.pageX, sy: t.pageY, base, cleanup };
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchcancel', handleUp);
    window.addEventListener('blur', handleUp);
  };

  return { beginMouse, beginTouch, takeMoved };
}

function dragProps(room, scale, onDrag, webDrag, startRef) {
  if (IS_WEB) {
    return {
      onMouseDown: (e) => webDrag.beginMouse(e, { ...room }),
      onTouchStart: (e) => webDrag.beginTouch(e, { ...room }),
    };
  }
  return {
    onStartShouldSetResponder: () => false,
    onMoveShouldSetResponder: () => true,
    onResponderGrant: (e) => {
      const { pageX, pageY } = pageOf(e);
      if (pageX == null) return;
      startRef.current = { pageX, pageY, base: { ...room } };
    },
    onResponderMove: (e) => {
      const st = startRef.current;
      if (!st) return;
      const { pageX, pageY } = pageOf(e);
      if (pageX == null || pageY == null) return;
      const k = Math.max(scale || 1, 0.05);
      onDrag((pageX - st.pageX) / k, (pageY - st.pageY) / k, st.base);
    },
    onResponderRelease: () => { startRef.current = null; },
    onResponderTerminate: () => { startRef.current = null; },
    onResponderTerminationRequest: () => false,
  };
}

/**
 * SquareHandle — small white square with thin dark stroke (reference style).
 * `corner` selects the resize mode: tl/tr/bl/br + t/b/l/r.
 * Visual stays ~12px on screen; invisible hit area stays ~30px for touch.
 * Edge handles (t/b/l/r) also support double-tap to duplicate via onDuplicate.
 */
const DOUBLE_TAP_MS = 350;
function SquareHandle({ hx, hy, scale, room, corner, onResize, onDuplicate }) {
  const start = useRef(null);
  const movedRef = useRef(false);
  const lastTap = useRef(0);
  const handleDrag = (dx, dy, base) => {
    movedRef.current = true;
    onResize(dx, dy, base);
  };
  const webDrag = useWebDrag({ scale, onDrag: handleDrag });
  const handleTap = () => {
    if (!onDuplicate) return;
    const webMoved = webDrag.takeMoved();
    const wasMoved = movedRef.current;
    movedRef.current = false;
    if (webMoved || wasMoved) return;
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0;
      onDuplicate(corner);
    } else {
      lastTap.current = now;
    }
  };
  const gestureProps = IS_WEB
    ? {
        onMouseDown: (e) => {
          movedRef.current = false;
          webDrag.beginMouse(e, { ...room });
        },
        onTouchStart: (e) => {
          movedRef.current = false;
          webDrag.beginTouch(e, { ...room });
        },
        ...(onDuplicate ? { onPress: handleTap } : null),
      }
    : {
        onStartShouldSetResponder: () => false,
        onMoveShouldSetResponder: () => true,
        onResponderGrant: (e) => {
          const { pageX, pageY } = pageOf(e);
          if (pageX == null) return;
          movedRef.current = false;
          start.current = { pageX, pageY, base: { ...room } };
        },
        onResponderMove: (e) => {
          const st = start.current;
          if (!st) return;
          const { pageX, pageY } = pageOf(e);
          if (pageX == null || pageY == null) return;
          const k = Math.max(scale || 1, 0.05);
          handleDrag((pageX - st.pageX) / k, (pageY - st.pageY) / k, st.base);
        },
        onResponderRelease: () => { start.current = null; },
        onResponderTerminate: () => { start.current = null; },
        onResponderTerminationRequest: () => false,
        ...(onDuplicate ? { onPress: handleTap } : null),
      };
  const vis = screen(HANDLE_VIS, scale);
  const hit = screen(HANDLE_HIT, scale);
  const lw = screen(LINE_SCREEN, scale);
  return (
    <G data-grip="1" {...gestureProps}>
      <Rect
        x={hx - hit / 2}
        y={hy - hit / 2}
        width={hit}
        height={hit}
        fill="white"
        fillOpacity={0}
        stroke="none"
      />
      <Rect
        x={hx - vis / 2}
        y={hy - vis / 2}
        width={vis}
        height={vis}
        fill="#FFFFFF"
        stroke={SEL}
        strokeWidth={lw}
      />
    </G>
  );
}

/** MoveArea — drag anywhere inside the selected room to move it. */
function MoveArea({ room, scale, onMove }) {
  const start = useRef(null);
  const doMove = (dx, dy, base) => {
    onMove(room.id, {
      x: snap(Math.min(Math.max(0, base.x + dx), FLOOR_W - base.width)),
      y: snap(Math.min(Math.max(0, base.y + dy), FLOOR_H - base.height)),
    });
  };
  const webDrag = useWebDrag({ scale, onDrag: doMove });
  return (
    <Rect
      data-grip="1"
      x={room.x}
      y={room.y}
      width={room.width}
      height={room.height}
      fill="white"
      fillOpacity={0}
      {...dragProps(room, scale, doMove, webDrag, start)}
    />
  );
}

/**
 * DoorPositionHandle — green ↔ grip sitting on the door centre.
 * Drag along the wall to slide the door (updates door.position 0..1).
 * Like the reference: small round handle with side arrows.
 */
const DOOR_HANDLE = '#16A34A';
function DoorPositionHandle({ room, doorIndex, spec, tick, scale, onDoorPosition }) {
  const start = useRef(null);
  const anchor = getDoorAnchor(room, spec, tick);
  const doSlide = (dx, dy, base) => {
    const len = base.__doorLen;
    if (!len) return;
    const delta = base.__horizontal ? dx : dy;
    const next = Math.min(1, Math.max(0, (base.__doorC + delta) / len));
    onDoorPosition(doorIndex, Math.round(next * 100) / 100);
  };
  const webDrag = useWebDrag({ scale, onDrag: doSlide });
  if (!anchor) return null;
  const r = screen(13, scale);
  const hit = screen(32, scale);
  const lw = screen(1.5, scale);
  const a = r * 0.45;
  const glyph = anchor.horizontal
    ? `M ${anchor.x - a * 1.8} ${anchor.y} L ${anchor.x - a * 0.6} ${anchor.y - a} L ${anchor.x - a * 0.6} ${anchor.y + a} Z ` +
      `M ${anchor.x + a * 1.8} ${anchor.y} L ${anchor.x + a * 0.6} ${anchor.y - a} L ${anchor.x + a * 0.6} ${anchor.y + a} Z`
    : `M ${anchor.x} ${anchor.y - a * 1.8} L ${anchor.x - a} ${anchor.y - a * 0.6} L ${anchor.x + a} ${anchor.y - a * 0.6} Z ` +
      `M ${anchor.x} ${anchor.y + a * 1.8} L ${anchor.x - a} ${anchor.y + a * 0.6} L ${anchor.x + a} ${anchor.y + a * 0.6} Z`;
  const base = { ...room, __doorC: anchor.c, __doorLen: anchor.len, __horizontal: anchor.horizontal };
  return (
    <G
      data-grip="1"
      {...(IS_WEB
        ? {
            onMouseDown: (e) => webDrag.beginMouse(e, base),
            onTouchStart: (e) => webDrag.beginTouch(e, base),
          }
        : {
            onStartShouldSetResponder: () => false,
            onMoveShouldSetResponder: () => true,
            onResponderGrant: (e) => {
              const { pageX, pageY } = pageOf(e);
              if (pageX == null) return;
              start.current = { pageX, pageY, base };
            },
            onResponderMove: (e) => {
              const st = start.current;
              if (!st) return;
              const { pageX, pageY } = pageOf(e);
              if (pageX == null || pageY == null) return;
              const k = Math.max(scale || 1, 0.05);
              doSlide((pageX - st.pageX) / k, (pageY - st.pageY) / k, st.base);
            },
            onResponderRelease: () => { start.current = null; },
            onResponderTerminate: () => { start.current = null; },
            onResponderTerminationRequest: () => false,
          })}
    >
      <Circle cx={anchor.x} cy={anchor.y} r={hit / 2} fill="white" fillOpacity={0} stroke="none" />
      <Circle cx={anchor.x} cy={anchor.y} r={r} fill="#FFFFFF" stroke={DOOR_HANDLE} strokeWidth={lw * 1.4} />
      <Path d={glyph} fill={DOOR_HANDLE} pointerEvents="none" />
    </G>
  );
}

function EditableEntity({ room, selected, scale, editable, eraseMode, onSelect, onDelete, onResize, onMove, onDoorPosition, onDuplicate, labelScale }) {
  // Tap empty entity to select. Tapping the already-selected one keeps it
  // selected (so move-drags don't accidentally deselect); tap the
  // background to deselect.
  const handlePress = () => {
    if (eraseMode) onDelete(room.id);
    else if (!selected) onSelect(room.id);
  };

  const kind = kindOf(room);
  const unselectedBody = kind === 'cr'
    ? (
      <ComfortRoom
        x={room.x}
        y={room.y}
        width={room.width}
        height={room.height}
        type={room.crType ?? 'male'}
        doorPosition={room.doorPosition ?? 'bottomLeft'}
        id={room.id}
        selected={false}
        onPress={handlePress}
        labelScale={labelScale}
      />
    )
    : kind === 'stair'
      ? (
        <G onPress={handlePress}>
          {/* invisible hit layer so gaps (open well) still select */}
          <Rect x={room.x} y={room.y} width={room.width} height={room.height} fill="white" fillOpacity={0} />
          <DoubleFlightStairs
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            facing={room.facing ?? 'right'}
            upSide={room.upSide ?? 'left'}
            hasBelow={Boolean(room.hasBelow)}
          />
        </G>
      )
      : null;

  // In edit mode suppress pink selected styling — the reference
  // keeps the body unchanged and shows only the thin dashed frame.
  const body = unselectedBody ?? (
    <Room room={room} selected={editable ? false : selected} onPress={handlePress} labelScale={labelScale} />
  );

  // View-mode CR still needs its selected tint when tapped.
  const viewBody = (!editable && kind === 'cr' && selected)
    ? (
      <ComfortRoom
        x={room.x}
        y={room.y}
        width={room.width}
        height={room.height}
        type={room.crType ?? 'male'}
        doorPosition={room.doorPosition ?? 'bottomLeft'}
        id={room.id}
        selected
        onPress={handlePress}
        labelScale={labelScale}
      />
    )
    : body;

  if (!editable) return <G>{viewBody}</G>;

  // Reference selection: move by dragging inside, 8 small squares resize.
  // Works identically for rooms, CRs and stairs.
  if (!selected) return <G>{body}</G>;
  const cx = room.x + room.width / 2;
  const cyMid = room.y + room.height / 2;
  const lw = screen(LINE_SCREEN, scale);
  const dash = `${screen(12, scale)} ${screen(8, scale)}`;
  const tick = Math.min(room.width, room.height) * 0.10;
  const doorList = room.door == null ? [] : Array.isArray(room.door) ? room.door : [room.door];
  // Double-tap an edge handle duplicates the room into the adjacent cell.
  // Rooms only (M-series naming); corners have no duplicate action.
  const handleEdgeDuplicate =
    onDuplicate && kindOf(room) === 'room'
      ? (side) => onDuplicate(room.id, side)
      : undefined;
  return (
    <G>
      {body}
      <G pointerEvents="box-none">
        {/* drag inside to move (below handles so grips win) */}
        <MoveArea room={room} scale={scale} onMove={onMove} />
        {/* thin dark dashed frame exactly on the room edge */}
        <Rect
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
          fill="none"
          stroke={SEL}
          strokeWidth={lw}
          strokeDasharray={dash}
          pointerEvents="none"
        />
        {/* corners */}
        <SquareHandle hx={room.x} hy={room.y} scale={scale} room={room} corner="tl"
          onResize={(dx, dy, base) => onResize(base ?? room, 'tl', dx, dy)} />
        <SquareHandle hx={room.x + room.width} hy={room.y} scale={scale} room={room} corner="tr"
          onResize={(dx, dy, base) => onResize(base ?? room, 'tr', dx, dy)} />
        <SquareHandle hx={room.x} hy={room.y + room.height} scale={scale} room={room} corner="bl"
          onResize={(dx, dy, base) => onResize(base ?? room, 'bl', dx, dy)} />
        <SquareHandle hx={room.x + room.width} hy={room.y + room.height} scale={scale} room={room} corner="br"
          onResize={(dx, dy, base) => onResize(base ?? room, 'br', dx, dy)} />
        {/* edge mids — double-tap duplicates into the adjacent cell */}
        <SquareHandle hx={cx} hy={room.y} scale={scale} room={room} corner="t"
          onResize={(dx, dy, base) => onResize(base ?? room, 't', dx, dy)} onDuplicate={handleEdgeDuplicate} />
        <SquareHandle hx={cx} hy={room.y + room.height} scale={scale} room={room} corner="b"
          onResize={(dx, dy, base) => onResize(base ?? room, 'b', dx, dy)} onDuplicate={handleEdgeDuplicate} />
        <SquareHandle hx={room.x} hy={cyMid} scale={scale} room={room} corner="l"
          onResize={(dx, dy, base) => onResize(base ?? room, 'l', dx, dy)} onDuplicate={handleEdgeDuplicate} />
        <SquareHandle hx={room.x + room.width} hy={cyMid} scale={scale} room={room} corner="r"
          onResize={(dx, dy, base) => onResize(base ?? room, 'r', dx, dy)} onDuplicate={handleEdgeDuplicate} />
        {/* door slide grips — drag along the wall (hidden for double-corner) */}
        {kindOf(room) === 'room' && onDoorPosition && doorList.map((spec, i) => (
          <DoorPositionHandle
            key={`doorpos-${i}`}
            room={room}
            doorIndex={i}
            spec={spec}
            tick={tick}
            scale={scale}
            onDoorPosition={onDoorPosition}
          />
        ))}
      </G>
    </G>
  );
}

export function applyResize(room, corner, dx, dy) {
  const dw = snap(dx);
  const dh = snap(dy);
  let { x, y, width, height } = room;
  if (corner === 'br') {
    width = Math.max(MIN_SIZE, snap(width + dw));
    height = Math.max(MIN_SIZE, snap(height + dh));
  } else if (corner === 'tr') {
    width = Math.max(MIN_SIZE, snap(width + dw));
    const nh = Math.max(MIN_SIZE, snap(height - dh));
    y = snap(y + (height - nh));
    height = nh;
  } else if (corner === 'bl') {
    const nw = Math.max(MIN_SIZE, snap(width - dw));
    x = snap(x + (width - nw));
    width = nw;
    height = Math.max(MIN_SIZE, snap(height + dh));
  } else if (corner === 'tl') {
    const nw = Math.max(MIN_SIZE, snap(width - dw));
    const nh = Math.max(MIN_SIZE, snap(height - dh));
    x = snap(x + (width - nw));
    y = snap(y + (height - nh));
    width = nw;
    height = nh;
  } else if (corner === 't') {
    // top edge: stretch height from the top (dy only)
    const nh = Math.max(MIN_SIZE, snap(height - dh));
    y = snap(y + (height - nh));
    height = nh;
  } else if (corner === 'b') {
    // bottom edge: stretch height from the bottom (dy only)
    height = Math.max(MIN_SIZE, snap(height + dh));
  } else if (corner === 'l') {
    // left edge: stretch width from the left (dx only)
    const nw = Math.max(MIN_SIZE, snap(width - dw));
    x = snap(x + (width - nw));
    width = nw;
  } else if (corner === 'r') {
    // right edge: stretch width from the right (dx only)
    width = Math.max(MIN_SIZE, snap(width + dw));
  }
  x = Math.min(Math.max(0, x), FLOOR_W - MIN_SIZE);
  y = Math.min(Math.max(0, y), FLOOR_H - MIN_SIZE);
  width = Math.min(width, FLOOR_W - x);
  height = Math.min(height, FLOOR_H - y);
  void SNAP;
  return { x, y, width, height };
}

export default function EditableFloorPlan({
  rooms = [],
  selectedId = null,
  onSelect,
  onUpdate,
  onDelete,
  onAddAt,
  onDoorPosition,
  onDuplicate,
  editMode = false,
  editTool = 'select',
  zoom = 1,
}) {
  const labelScale = Math.min(1, Math.max(0.5, 1 / Math.max(zoom, 0.2)));
  const eraseMode = editMode && editTool === 'erase';
  const editable = editMode && editTool === 'select';

  const handleBackgroundPress = (e) => {
    if (editMode && editTool === 'add') {
      const loc = locationOf(e);
      if (loc) onAddAt?.(loc.x, loc.y);
      else onAddAt?.(FLOOR_W / 2, FLOOR_H / 2);
    } else {
      onSelect?.(null);
    }
  };

  return (
    <Svg
      viewBox={`0 0 ${FLOOR_W} ${FLOOR_H}`}
      width={FLOOR_W}
      height={FLOOR_H}
      preserveAspectRatio="xMidYMid meet"
      style={[styles.wrapper, { width: FLOOR_W, height: FLOOR_H }]}
    >
      {/* floor slab — tap target for add-room / deselect */}
      <Rect
        x={0}
        y={0}
        width={FLOOR_W}
        height={FLOOR_H}
        fill={theme.colors.canvas}
        stroke={theme.colors.hairlineStrong}
        strokeWidth={6}
        onPress={handleBackgroundPress}
      />

      {/* static architectural layer (rooms, CRs and stairs are editable entities) */}
      <OpenToBelow x={1920} y={750} width={1150} height={750} />
      <Quadrangle x={1500} y={1700} width={2000} height={900} />

      {rooms.map((room) => (
        <EditableEntity
          key={room.id}
          room={room}
          selected={selectedId === room.id}
          scale={zoom}
          editable={editable}
          eraseMode={eraseMode}
          labelScale={labelScale}
          onSelect={onSelect}
          onDelete={onDelete}
          onMove={(id, patch) => onUpdate?.(id, patch)}
          onResize={(r, corner, dx, dy) => onUpdate?.(r.id, applyResize(r, corner, dx, dy))}
          onDoorPosition={(doorIndex, position) => onDoorPosition?.(room.id, doorIndex, position)}
          onDuplicate={(id, side) => onDuplicate?.(id, side)}
        />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.canvas,
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});
