import { G, Path, Rect, Text } from 'react-native-svg';
import RoomDoor from './Door';
import { theme } from '../../theme';

/**
 * Room: standard room body with optional doors.
 *
 * `door` (or `room.door`) is one door object or an array of them:
 *
 *  {
 *    wall:     'bottom' | 'top' | 'left' | 'right'   // default 'bottom'
 *    hinge:    'left' | 'right'                      // default 'left'
 *              (on left/right walls use 'top' | 'bottom')
 *    swing:    'in' | 'out'                          // default 'in'
 *    type:     'single' | 'double' | 'double-corner'   // default 'single'
 *    position: 0..1   // door centre along the wall  // default 0.5
 *    width:    number // opening size in px           // default auto
 *  }
 *
 * A 'double' door is two leaves side by side, hinged on the outer jambs
 * and meeting in the middle (`hinge` is ignored).
 * A 'double-corner' door is two single leaves on the same wall, one tucked
 * into each corner, both hinged at the outer corners (`position`/`hinge`
 * are ignored).
 *
 * @example
 *  <Room room={r} door={{ wall: 'bottom', hinge: 'right', swing: 'out' }} />
 *  <Room room={r} door={{ wall: 'top', type: 'double' }} />
 *  <Room room={r} door={[{ wall: 'top' }, { wall: 'bottom', hinge: 'right' }]} />
 */
export default function Room({
  room,
  selected = false,
  onPress,
  labelScale = 1,
  door,
}) {
  const handlePress = () => {
    if (onPress) {
      onPress(room.id);
    }
  };

  const cx = room.x + room.width / 2;
  const cy = room.y + room.height / 2;
  // Corner tick length, proportional to the smaller side
  const tick = Math.min(room.width, room.height) * 0.10;
  const inset = 20;
  const wall = selected ? theme.colors.primary : theme.colors.roomBorder;
  const tickStroke = selected ? theme.colors.primaryFocus : theme.colors.hairlineStrong;
  const wallW = selected ? 8 : 6;
  const bodyFill = selected ? theme.colors.primarySoft : theme.colors.roomFill;

  const doors = toList(
  door ?? room.door
);

return (
  <G onPress={handlePress}>

    {selected && (
      <Rect
        x={room.x - 10}
        y={room.y - 10}
        width={room.width + 20}
        height={room.height + 20}
        rx={4}
        fill={theme.colors.primaryGlow}
      />
    )}

    <Rect
      x={room.x}
      y={room.y}
      width={room.width}
      height={room.height}
      fill={bodyFill}
      stroke={wall}
      strokeWidth={wallW}
    />

    <Rect
      x={room.x + inset}
      y={room.y + inset}
      width={room.width - inset * 2}
      height={room.height - inset * 2}
      fill="none"
      stroke={theme.colors.hairline}
      strokeWidth={2}
    />

    <Path
      d={`M ${room.x} ${room.y + tick}
          L ${room.x} ${room.y}
          L ${room.x + tick} ${room.y}

          M ${room.x + room.width - tick} ${room.y}
          L ${room.x + room.width} ${room.y}
          L ${room.x + room.width} ${room.y + tick}

          M ${room.x + room.width}
          ${room.y + room.height - tick}
          L ${room.x + room.width}
          ${room.y + room.height}
          L ${room.x + room.width - tick}
          ${room.y + room.height}

          M ${room.x + tick}
          ${room.y + room.height}
          L ${room.x}
          ${room.y + room.height}
          L ${room.x}
          ${room.y + room.height - tick}`}
      fill="none"
      stroke={tickStroke}
      strokeWidth={4}
      strokeLinecap="square"
    />

    {doors.map((spec, i) => (
      <RoomDoor
        key={`door-${i}`}
        room={room}
        {...spec}
        tick={tick}
        wallWidth={wallW}
        wallColor={wall}
        gapColor={bodyFill}
      />
    ))}

    <Text
      x={cx}
      y={cy}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize={30 * labelScale}
      fontWeight="900"
      letterSpacing={2}
      fill={
        selected
          ? theme.colors.primaryFocus
          : theme.colors.ink
      }
      pointerEvents="none"
    >
      {room.label ?? room.id}
    </Text>

  </G>
);
}

const toList = (d) => (d == null ? [] : Array.isArray(d) ? d : [d]);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function normalizeWall(w) {
  const k = String(w ?? 'bottom').toLowerCase();
  return ['top', 'bottom', 'left', 'right'].includes(k) ? k : 'bottom';
}

/**
 * One door: wall gap + hollow jambs + solid leaf(s) + dashed swing arc(s).
 * Works on any wall by using a local frame:
 *   O = wall start, u = direction along the wall, n = normal pointing INTO the room.
 */
