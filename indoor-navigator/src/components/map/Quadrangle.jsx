import { G, Line, Path, Rect, Text } from 'react-native-svg';
import { theme } from '../../theme';

/**
 * Quadrangle: open courtyard block, traced from the reference plan.
 *
 *  - Outer wall with solid square pilasters every 10% (top/bottom)
 *    and every 20% (sides)
 *  - Full-height brick divider (running bond) at ~50-60% of the width
 *  - West stage: double west wall, stair blocks top & bottom,
 *    curved front bulging east, two small floor markers
 *  - Two short stair flights crossing the west wall
 *  - "E" entrance alcove on the south wall (pushes INTO the courtyard)
 *  - Door swings on the east wall and at the NE corner
 *
 * Reference aspect ratio is ~1.97 : 1, so 2400 wide → ~1220 tall.
 *
 * @example
 *  <Quadrangle x={380} y={2200} width={2400} height={1220} />
 */
export default function Quadrangle({
  x = 0,
  y = 0,
  width = 2400,
  height = 1220,
  showLabel = true,
  labelScale = 1,
  selected = false,
  onPress,
}) {
  const W = width;
  const H = height;
  const m = Math.min(W, H);

  const wall = selected ? theme.colors.primary : theme.colors.roomBorder;
  const fill = theme.colors.roomFill;
  const brickFill = theme.colors.surface2;
  const ink = theme.colors.ink;

  const wt = m * 0.011; // main wall stroke
  const thin = wt * 0.4; // detail lines
  const pil = m * 0.024; // pilaster size
  const gapW = wt * 1.8; // stroke used to "cut" the wall

  /* ── brick divider ── */
  const brickX = W * 0.504;
  const brickW = W * 0.092;
  const rows = 36;
  const rowH = H / rows;

  /* ── west stage ── */
  const sx0 = W * 0.036; // stage west wall
  const sx1 = W * 0.143; // stage east edge (where the curve starts/ends)
  const bulgeX = W * 0.178; // furthest point of the curved front
  const sy0 = H * 0.059;
  const sy1 = H * 0.945;
  const stH = H * 0.095; // stair block height
  const stX = W * 0.078; // stair block west edge
  const curveTop = sy0 + stH;
  const curveBot = sy1 - stH;
  // cubic with both control points at c peaks at x0 + 0.75 * (c - x0)
  const ctrlX = sx1 + (bulgeX - sx1) / 0.75;

  /* ── south-east "E" alcove ── */
  const ex0 = W * 0.912;
  const ex1 = W * 0.961;
  const ey0 = H * 0.828;
  const eBoxX = ex0 + (ex1 - ex0) * 0.12;
  const eBoxW = (ex1 - ex0) * 0.76;
  const eBoxY = ey0 + H * 0.012;
  const eBoxH = H * 0.074;
  const eFont = Math.min((ex1 - ex0) * 0.5, H * 0.05);


  const labelSize = Math.min(W * 0.048, H * 0.095) * labelScale;

  const pilaster = (key, cx, cy) => (
    <Rect
      key={key}
      x={cx - pil / 2}
      y={cy - pil / 2}
      width={pil}
      height={pil}
      fill={wall}
    />
  );

  const tenths = Array.from({ length: 11 }, (_, i) => i / 10);
  const fifths = [0.2, 0.4, 0.6, 0.8];

  // small door in the stage lobby (hinge, leaf, swing)
  const lobbyDoor = (key, top) => {
    const hx = W * 0.058;
    const hy = top ? curveTop : curveBot;
    const r = W * 0.014;
    const ly = top ? hy - r : hy + r;
    return (
      <G key={key}>
        <Line x1={hx} y1={hy} x2={hx} y2={ly} stroke={wall} strokeWidth={thin * 1.4} />
        <Path
          d={`M ${hx} ${ly} A ${r} ${r} 0 0 ${top ? 1 : 0} ${hx + r} ${hy}`}
          fill="none"
          stroke={wall}
          strokeWidth={thin}
        />
      </G>
    );
  };

  return (
    <G onPress={() => onPress?.('Quadrangle')}>
      <G transform={`translate(${x},${y})`}>
        {/* courtyard slab */}
        <Rect x={0} y={0} width={W} height={H} fill={fill} stroke="none" />

        {/* ── brick divider (running bond) ── */}
        <Rect
  x={brickX}
  y={0}
  width={brickW}
  height={H}
  fill={brickFill}
  stroke="none"
/>
{Array.from({ length: rows }).map((_, r) => {
  const y0 = r * rowH;
  const joints = r % 2 === 0 ? [0.4, 0.8] : [0.2, 0.6];
  return (
    <G key={`row-${r}`}>
      {r > 0 && (
        <Line
          x1={brickX}
          y1={y0}
          x2={brickX + brickW}
          y2={y0}
          stroke={wall}
          strokeWidth={wt * 0.55}
        />
      )}
      {joints.map((j) => (
        <Line
          key={j}
          x1={brickX + brickW * j}
          y1={y0}
          x2={brickX + brickW * j}
          y2={y0 + rowH}
          stroke={wall}
          strokeWidth={wt * 0.55}
        />
      ))}
    </G>
  );
})}
{/* thick side walls */}
{[brickX, brickX + brickW].map((sx) => (
  <Line
    key={`bs-${sx}`}
    x1={sx}
    y1={0}
    x2={sx}
    y2={H}
    stroke={wall}
    strokeWidth={wt * 0.9}
  />
))}

        {/* ── west stage ── */}
        {/* U-shaped wall, open to the east */}
        <Path
          d={`M ${sx1} ${sy0} L ${sx0} ${sy0} L ${sx0} ${sy1} L ${sx1} ${sy1}`}
          fill="none"
          stroke={wall}
          strokeWidth={wt * 0.8}
          strokeLinejoin="miter"
        />
        {/* inner skin of the west wall (double line) */}
        <Line
          x1={sx0 + W * 0.008}
          y1={sy0}
          x2={sx0 + W * 0.008}
          y2={sy1}
          stroke={wall}
          strokeWidth={thin * 1.2}
        />
        {/* curved front, bulges east */}
        <Path
          d={`M ${sx1} ${curveTop} C ${ctrlX} ${curveTop} ${ctrlX} ${curveBot} ${sx1} ${curveBot}`}
          fill="none"
          stroke={wall}
          strokeWidth={wt * 0.8}
          strokeLinecap="round"
        />
        {/* stair blocks, top & bottom */}
        <Stairs x={stX} y={sy0} w={sx1 - stX} h={stH} n={8} wall={wall} fill={fill} line={thin} />
        <Stairs x={stX} y={sy1 - stH} w={sx1 - stX} h={stH} n={8} wall={wall} fill={fill} line={thin} />
        {/* lobby doors */}
        {lobbyDoor('ld-top', true)}
        {lobbyDoor('ld-bot', false)}
        {/* two floor markers */}
        {[0.4, 0.592].map((f) => (
          <Rect
            key={`mk-${f}`}
            x={W * 0.0625}
            y={H * f - H * 0.008}
            width={W * 0.029}
            height={H * 0.016}
            fill={brickFill}
            stroke={wall}
            strokeWidth={thin * 1.2}
          />
        ))}

        {/* ── outer wall ── */}
        <Path
          d={
            `M ${brickX} 0 L 0 0 L 0 ${H} L ${brickX} ${H} ` +
            `M ${brickX + brickW} ${H} L ${W} ${H} L ${W} 0 L ${brickX + brickW} 0`
          }
          fill="none"
          stroke={wall}
          strokeWidth={wt}
          strokeLinejoin="miter"
        />
       

        {/* ── stair flights crossing the west wall ── */}
        {[0.385, 0.62].map((f) => {
          const hh = H * 0.045;
          return (
            <G key={`ws-${f}`}>
              <Line
                x1={0}
                y1={H * f - hh / 2}
                x2={0}
                y2={H * f + hh / 2}
                stroke={fill}
                strokeWidth={gapW}
              />
              <Stairs x={0} y={H * f - hh / 2} w={sx0} h={hh} n={4} wall={wall} fill={fill} line={thin} />
            </G>
          );
        })}

      

       

        {/* ── pilasters (solid) ── */}
        {tenths.map((f) => pilaster(`pt-${f}`, W * f, 0))}
        {tenths.map((f) => pilaster(`pb-${f}`, W * f, H))}
        {pilaster('pw-1', 0, H * 0.2)}
        {pilaster('pw-2', 0, H * 0.8)}
        {fifths.map((f) => pilaster(`pe-${f}`, W, H * f))}

        {/* ── south-east "E" alcove (opens to the outside, pushes into courtyard) ── */}
        <Rect x={ex0} y={ey0} width={ex1 - ex0} height={H - ey0} fill={fill} stroke="none" />
        <Line x1={ex0} y1={H} x2={ex1} y2={H} stroke={fill} strokeWidth={gapW} />
        <Path
          d={`M ${ex0} ${H} L ${ex0} ${ey0} L ${ex1} ${ey0} L ${ex1} ${H}`}
          fill="none"
          stroke={wall}
          strokeWidth={wt * 0.9}
          strokeLinejoin="miter"
        />
        <Rect
          x={eBoxX}
          y={eBoxY}
          width={eBoxW}
          height={eBoxH}
          fill={fill}
          stroke={wall}
          strokeWidth={thin * 1.2}
        />
        <Text
          x={eBoxX + eBoxW / 2}
          y={eBoxY + eBoxH / 2 + eFont * 0.35}
          textAnchor="middle"
          fontSize={eFont}
          fontWeight="800"
          fontFamily="serif"
          fill={ink}
          pointerEvents="none"
        >
          E
        </Text>

        {/* ── QUADRANGLE label (sits over the divider, like the plan) ── */}
        {showLabel && (
          <Text
            x={W * 0.535}
            y={H * 0.488 + labelSize * 0.35}
            textAnchor="middle"
            fontSize={labelSize}
            fontWeight="900"
            fontFamily="serif"
            fill={ink}
            pointerEvents="none"
          >
            QUADRANGLE
          </Text>
        )}
      </G>
    </G>
  );
}

/* Stair block: outlined rect with evenly spaced treads. */
function Stairs({ x, y, w, h, n, wall, fill, line }) {
  const treads = [];
  for (let i = 1; i < n; i++) {
    const ly = y + (h * i) / n;
    treads.push(
      <Line key={i} x1={x} y1={ly} x2={x + w} y2={ly} stroke={wall} strokeWidth={line} />
    );
  }
  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} fill={fill} stroke={wall} strokeWidth={line * 1.4} />
      {treads}
    </G>
  );
}