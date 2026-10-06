import { G, Line, Path, Rect } from 'react-native-svg';
import { theme } from '../../theme';

export function getDoorAnchor(room, spec = {}, tick = 0) {
  const type = String(spec.type ?? 'single').toLowerCase();
  if (type === 'double-corner' || type === 'doublecorner') return null;
  const { x, y, width: roomWidth, height: roomHeight } = room;
  const side = normalizeWall(spec.wall);
  const horizontal = side === 'top' || side === 'bottom';
  const len = horizontal ? roomWidth : roomHeight;
  const position = typeof spec.position === 'number' ? spec.position : 0.5;
  const isDouble = type === 'double';
  const D = spec.width ?? (isDouble ? Math.min(150, len * 0.55) : Math.min(84, len * 0.3));
  const margin = tick + 12;
  const lo = margin + D / 2;
  const hi = len - margin - D / 2;
  const c = lo <= hi ? clamp(position * len, lo, hi) : len / 2;
  const O = side === 'top' ? [x, y]
    : side === 'bottom' ? [x, y + roomHeight]
    : side === 'left' ? [x, y]
    : [x + roomWidth, y];
  const u = (side === 'top' || side === 'bottom') ? [1, 0] : [0, 1];
  const n = side === 'top' ? [0, 1] : side === 'bottom' ? [0, -1] : side === 'left' ? [1, 0] : [-1, 0];
  const px = O[0] + u[0] * c;
  const py = O[1] + u[1] * c;
  return { x: px, y: py, c, len, horizontal, D };
}

export default function Door({
  room,

  wall = 'bottom',
  hinge = 'left',
  swing = 'in',

  type = 'single',
  position = 0.5,
  width,

  wallWidth = 6,
  wallColor,
  gapColor,

  tick = 0,

  jambs = true,
  jambSize,

  cornerRadius,
}) {
  const {
    x,
    y,
    width: roomWidth,
    height: roomHeight,
  } = room;

  const side = normalizeWall(wall);

  const horizontal =
    side === 'top' ||
    side === 'bottom';

  const len = horizontal
    ? roomWidth
    : roomHeight;

  const wallColorFinal =
    wallColor ??
    theme.colors.roomBorder;

  const gapColorFinal =
    gapColor ??
    theme.colors.roomFill;

  const isDouble =
    type === 'double';

  const isDoubleCorner =
    type === 'double-corner' ||
    type === 'doubleCorner';

  const isOut =
    String(swing)
      .toLowerCase()
      .startsWith('out');

  /*
   * Positive = into room.
   * Negative = outside room.
   */
  const sign = isOut ? -1 : 1;

  /*
   * Wall coordinate system.
   *
   * O = start of wall
   * u = direction along wall
   * n = direction into room
   */
  const frames = {
    top: {
      O: [x, y],
      u: [1, 0],
      n: [0, 1],
    },

    bottom: {
      O: [x, y + roomHeight],
      u: [1, 0],
      n: [0, -1],
    },

    left: {
      O: [x, y],
      u: [0, 1],
      n: [1, 0],
    },

    right: {
      O: [x + roomWidth, y],
      u: [0, 1],
      n: [-1, 0],
    },
  };

  const { O, u, n } =
    frames[side];

  /*
   * Convert local wall coordinates
   * into SVG coordinates.
   */
  const pt = (t, s = 0) => [
    O[0] + u[0] * t + n[0] * s,
    O[1] + u[1] * t + n[1] * s,
  ];

  /*
   * ------------------------------------------------------
   * DOUBLE CORNER
   * ------------------------------------------------------
   *
   * Two independent single leaves on the SAME wall,
   * one hinged at each corner, both swinging in.
   *
   *   ─╮                    ╭─
   *    │  (arc)      (arc)  │
   *    │                    │
   *
   * Matches the ROOM 101 reference: a door tucked into
   * each top corner instead of one centered opening.
   */
  if (isDoubleCorner) {
    return (
      <DoubleCornerDoor
        room={room}
        pt={pt}
        len={len}
        tick={tick}
        position={position}
        width={width}
        wallWidth={wallWidth}
        wallColor={wallColorFinal}
        gapColor={gapColorFinal}
        jambs={jambs}
        jambSize={jambSize}
        cornerRadius={cornerRadius}
        sign={sign}
      />
    );
  }

  /*
   * ------------------------------------------------------
   * NORMAL / DOUBLE DOOR
   * ------------------------------------------------------
   */

  const D =
    width ??
    (
      isDouble
        ? Math.min(150, len * 0.55)
        : Math.min(84, len * 0.30)
    );

  const margin =
    tick + 12;

  const lo =
    margin + D / 2;

  const hi =
    len - margin - D / 2;

  const c =
    lo <= hi
      ? clamp(
          position * len,
          lo,
          hi
        )
      : len / 2;

  const a = c - D / 2;
  const b = c + D / 2;

  const [g1x, g1y] =
    pt(a);

  const [g2x, g2y] =
    pt(b);

  const jamb =
    jambSize ??
    wallWidth + 5;

  /*
   * DOUBLE DOOR
   */
  const leaves = isDouble
    ? [
        {
          h: a,
          f: c,
          r: D / 2,
        },
        {
          h: b,
          f: c,
          r: D / 2,
        },
      ]
    : [
        hingeIsEnd(hinge)
          ? {
              h: b,
              f: a,
              r: D,
            }
          : {
              h: a,
              f: b,
              r: D,
            },
      ];

  return (
    <G pointerEvents="none">

      {/* ============================================== */}
      {/* WALL OPENING                                  */}
      {/* ============================================== */}

      <Line
        x1={g1x}
        y1={g1y}
        x2={g2x}
        y2={g2y}
        stroke={gapColorFinal}
        strokeWidth={wallWidth + 2}
      />

      {/* ============================================== */}
      {/* SWING ARCS                                    */}
      {/* ============================================== */}

      {leaves.map((leaf, index) => {
        const [
          hx,
          hy,
        ] = pt(leaf.h);

        const [
          tx,
          ty,
        ] = pt(
          leaf.h,
          sign * leaf.r
        );

        const [
          fx,
          fy,
        ] = pt(leaf.f);

        const cross =
          (tx - hx) *
            (fy - hy) -
          (ty - hy) *
            (fx - hx);

        return (
          <Path
            key={`door-arc-${index}`}
            d={`
              M ${tx} ${ty}
              A ${leaf.r} ${leaf.r}
                0 0
                ${cross > 0 ? 1 : 0}
                ${fx} ${fy}
            `}
            fill="none"
            stroke={wallColorFinal}
            strokeWidth={2.5}
            strokeDasharray="7 5"
          />
        );
      })}

      {/* ============================================== */}
      {/* DOOR LEAVES                                   */}
      {/* ============================================== */}

      {leaves.map((leaf, index) => {
        const [
          hx,
          hy,
        ] = pt(leaf.h);

        const [
          tx,
          ty,
        ] = pt(
          leaf.h,
          sign * leaf.r
        );

        return (
          <Line
            key={`door-leaf-${index}`}
            x1={hx}
            y1={hy}
            x2={tx}
            y2={ty}
            stroke={wallColorFinal}
            strokeWidth={4.5}
            strokeLinecap="square"
          />
        );
      })}

      {/* ============================================== */}
      {/* JAMBS                                         */}
      {/* ============================================== */}

      {jambs &&
        [
          [g1x, g1y],
          [g2x, g2y],
        ].map(
          ([jx, jy], index) => (
            <Rect
              key={`door-jamb-${index}`}
              x={
                jx - jamb / 2
              }
              y={
                jy - jamb / 2
              }
              width={jamb}
              height={jamb}
              fill={gapColorFinal}
              stroke={wallColorFinal}
              strokeWidth={2.5}
            />
          )
        )}
    </G>
  );
}

/* ======================================================
 * DOUBLE CORNER DOOR
 * ====================================================== */

function DoubleCornerDoor({
  room,
  pt,
  len,
  tick,
  position,
  width,
  wallWidth,
  wallColor,
  gapColor,
  jambs,
  jambSize,
  cornerRadius,
  sign,
}) {
  void room;
  void position;
  void cornerRadius;

  // Per-leaf width. `width`, when given, is the TOTAL for both leaves.
  const leafD = width
    ? width / 2
    : Math.min(84, len * 0.3);

  const margin = tick + 12;

  // Left opening tucked into the start corner, right into the end corner.
  // If the wall is too short the two openings meet in the middle.
  const maxLeaf = Math.max(20, (len - margin * 2) / 2);
  const D = Math.min(leafD, maxLeaf);

  const openings = [
    { a: margin, b: margin + D, hingeAtStart: true },
    { a: len - margin - D, b: len - margin, hingeAtStart: false },
  ];

  const jamb =
    jambSize ??
    wallWidth + 5;

  return (
    <G pointerEvents="none">

      {openings.map((o, oi) => {
        const h = o.hingeAtStart ? o.a : o.b;
        const f = o.hingeAtStart ? o.b : o.a;

        const [g1x, g1y] = pt(o.a);
        const [g2x, g2y] = pt(o.b);
        const [hx, hy] = pt(h);
        const [tx, ty] = pt(h, sign * D);
        const [fx, fy] = pt(f);
        const cross =
          (tx - hx) * (fy - hy) -
          (ty - hy) * (fx - hx);

        return (
          <G key={`dc-${oi}`}>
            {/* wall opening */}
            <Line
              x1={g1x}
              y1={g1y}
              x2={g2x}
              y2={g2y}
              stroke={gapColor}
              strokeWidth={wallWidth + 2}
            />
            {/* swing arc */}
            <Path
              d={`
                M ${tx} ${ty}
                A ${D} ${D}
                  0 0
                  ${cross > 0 ? 1 : 0}
                  ${fx} ${fy}
              `}
              fill="none"
              stroke={wallColor}
              strokeWidth={2.5}
              strokeDasharray="7 5"
            />
            {/* leaf, hinged at the outer corner */}
            <Line
              x1={hx}
              y1={hy}
              x2={tx}
              y2={ty}
              stroke={wallColor}
              strokeWidth={4.5}
              strokeLinecap="square"
            />
            {/* jambs */}
            {jambs &&
              [
                [g1x, g1y],
                [g2x, g2y],
              ].map(([jx, jy], index) => (
                <Rect
                  key={`dc-jamb-${oi}-${index}`}
                  x={jx - jamb / 2}
                  y={jy - jamb / 2}
                  width={jamb}
                  height={jamb}
                  fill={gapColor}
                  stroke={wallColor}
                  strokeWidth={2.5}
                />
              ))}
          </G>
        );
      })}

    </G>
  );
}

/* ======================================================
 * HELPERS
 * ====================================================== */

function normalizeWall(wall) {
  const value =
    String(wall ?? 'bottom')
      .toLowerCase();

  return [
    'top',
    'bottom',
    'left',
    'right',
  ].includes(value)
    ? value
    : 'bottom';
}

function hingeIsEnd(hinge) {
  const value =
    String(hinge ?? 'left')
      .toLowerCase();

  return [
    'right',
    'bottom',
    'end',
  ].includes(value);
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}