import {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text,
} from 'react-native-svg';

import Room from './Room';
import Door from './Door';

import { theme } from '../../theme';

export default function ComfortRoom({
  x = 0,
  y = 0,
  width,
  height,
  type = 'male',
  id = 'CR',
  selected = false,
  onPress,
  labelScale = 1,
  showLabel = true,
  doorPosition = 'bottomLeft',
}) {
  const W = width ?? (type === 'split' ? 600 : 300);
  const H = height ?? 640;

  const handlePress = () => {
    onPress?.(id);
  };

  if (type === 'split') {
    const hw = W / 2;
    const main = normalizeDoor(doorPosition, 'bottomLeft');

    return (
      <G>
        {/* Male */}
        <ComfortSingle
          x={x}
          y={y}
          width={hw}
          height={H}
          gender="male"
          selected={selected}
          labelScale={labelScale}
          showLabel={showLabel}
          doorPos={main}
        />

        {/* Female */}
        <ComfortSingle
          x={x + hw}
          y={y}
          width={hw}
          height={H}
          gender="female"
          selected={selected}
          labelScale={labelScale}
          showLabel={showLabel}
          doorPos={mirrorDoor(main)}
        />

        {/* SELECT HITBOX */}
        <Rect
          x={x}
          y={y}
          width={W}
          height={H}
          fill="transparent"
          stroke="none"
          pointerEvents="auto"
          onPress={handlePress}
        />
      </G>
    );
  }

  return (
    <G>
      <ComfortSingle
        x={x}
        y={y}
        width={W}
        height={H}
        gender={type === 'female' ? 'female' : 'male'}
        selected={selected}
        labelScale={labelScale}
        showLabel={showLabel}
        doorPos={normalizeDoor(doorPosition, 'bottomLeft')}
      />

      {/* SELECT HITBOX */}
      <Rect
        x={x}
        y={y}
        width={W}
        height={H}
        fill="transparent"
        stroke="none"
        pointerEvents="auto"
        onPress={handlePress}
      />
    </G>
  );
}

/* Normalize door position */
function normalizeDoor(pos, fallback) {
  const k = String(pos ?? fallback)
    .toLowerCase()
    .replace(/[\s_-]/g, '');

  if (k === 'topleft' || k === 'lefttop') return 'topLeft';
  if (k === 'topright' || k === 'righttop') return 'topRight';
  if (k === 'bottomleft' || k === 'leftbottom') return 'bottomLeft';
  if (k === 'bottomright' || k === 'rightbottom') return 'bottomRight';

  if (k === 'top') return 'topLeft';
  if (k === 'bottom') return 'bottomLeft';

  return fallback;
}

/* Mirror Left ↔ Right */
function mirrorDoor(pos) {
  if (pos === 'topLeft') return 'topRight';
  if (pos === 'topRight') return 'topLeft';
  if (pos === 'bottomLeft') return 'bottomRight';
  if (pos === 'bottomRight') return 'bottomLeft';

  return pos;
}

function ComfortSingle({
  x,
  y,
  width,
  height,
  gender,
  selected,
  labelScale,
  showLabel,
  doorPos = 'bottomLeft',
}) {
  const isMale = gender === 'male';

  const accent = isMale
    ? theme.colors.brandBlueDark ?? '#1E40AF'
    : theme.colors.primaryFocus;

  const isTop = doorPos.startsWith('top');
  const isLeft = doorPos.endsWith('Left');

  const doorW = Math.min(
    88,
    width * 0.34,
    96
  );

  const tickLen = Math.min(width, height) * 0.1;

  const wallColor = selected
    ? theme.colors.primary
    : theme.colors.roomBorder;

  const cx = x + width / 2;

  const cy =
    y +
    height / 2 +
    (isTop
      ? doorW * 0.12
      : -doorW * 0.08);

  const nameLen = isMale ? 4 : 6;

  const labelSize = Math.min(
    25 * labelScale,
    (width - 40) / (nameLen * 0.62)
  );

  const subSize = Math.max(
    9,
    Math.min(
      18 * labelScale,
      labelSize * 0.6
    )
  );

  const iconS = Math.min(
    width * 0.22,
    40
  );

  return (
    <G pointerEvents="none">

      {/* ROOM */}
      <Room
        room={{
          id: '',
          x,
          y,
          width,
          height,
        }}
        selected={selected}
        labelScale={labelScale}
      />

      {/* DOOR */}
      <Door
        room={{
          x,
          y,
          width,
          height,
        }}
        wall={isTop ? 'top' : 'bottom'}
        hinge={isLeft ? 'left' : 'right'}
        swing="in"
        type="single"
        position={isLeft ? 0.22 : 0.78}
        width={doorW}
        wallWidth={6}
        wallColor={wallColor}
        gapColor={theme.colors.roomFill}
        tick={tickLen}
        jambs
        jambSize={11}
      />

      {/* LABEL */}
      {showLabel && (
        <G>
          {isMale ? (
            <MaleIcon
              cx={cx}
              cy={cy - iconS * 0.7}
              s={iconS}
              color={accent}
            />
          ) : (
            <FemaleIcon
              cx={cx}
              cy={cy - iconS * 0.7}
              s={iconS}
              color={accent}
            />
          )}

          <Text
            x={cx}
            y={cy + iconS}
            textAnchor="middle"
            fontSize={labelSize}
            fontWeight="900"
            letterSpacing={2}
            fill={accent}
          >
            {isMale ? 'MALE' : 'FEMALE'}
          </Text>

          <Text
            x={cx}
            y={
              cy +
              iconS * 0.6 +
              subSize +
              15
            }
            textAnchor="middle"
            fontSize={subSize}
            fontWeight="700"
            letterSpacing={4}
            fill={theme.colors.inkSubtle}
          >
            CR
          </Text>
        </G>
      )}
    </G>
  );
}

/* Male icon */
function MaleIcon({ cx, cy, s, color }) {
  const r = s * 0.28;

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy - s * 0.55}
        r={r}
        fill={color}
      />

      <Path
        d={
          `M ${cx - s * 0.38} ${cy - s * 0.15}
           L ${cx + s * 0.38} ${cy - s * 0.15}
           L ${cx + s * 0.3} ${cy + s * 0.25}
           L ${cx + s * 0.3} ${cy + s * 0.85}
           L ${cx + s * 0.08} ${cy + s * 0.85}
           L ${cx + s * 0.08} ${cy + s * 0.35}
           L ${cx - s * 0.08} ${cy + s * 0.35}
           L ${cx - s * 0.08} ${cy + s * 0.85}
           L ${cx - s * 0.3} ${cy + s * 0.85}
           L ${cx - s * 0.3} ${cy + s * 0.25}
           Z`
        }
        fill={color}
      />
    </G>
  );
}

/* Female icon */
function FemaleIcon({ cx, cy, s, color }) {
  const r = s * 0.28;

  return (
    <G>
      <Circle
        cx={cx}
        cy={cy - s * 0.55}
        r={r}
        fill={color}
      />

      <Path
        d={
          `M ${cx - s * 0.32} ${cy - s * 0.15}
           L ${cx + s * 0.32} ${cy - s * 0.15}
           L ${cx + s * 0.5} ${cy + s * 0.55}
           L ${cx - s * 0.5} ${cy + s * 0.55}
           Z`
        }
        fill={color}
      />

      <Line
        x1={cx - s * 0.15}
        y1={cy + s * 0.55}
        x2={cx - s * 0.18}
        y2={cy + s * 0.9}
        stroke={color}
        strokeWidth={s * 0.12}
        strokeLinecap="round"
      />

      <Line
        x1={cx + s * 0.15}
        y1={cy + s * 0.55}
        x2={cx + s * 0.18}
        y2={cy + s * 0.9}
        stroke={color}
        strokeWidth={s * 0.12}
        strokeLinecap="round"
      />
    </G>
  );
}