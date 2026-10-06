import { G } from 'react-native-svg';
import Room from './Room';

export default function CustomRooms({
  rooms = [],
  selectedRoom,
  onRoomClick,
  labelScale = 1,
}) {
  return (
    <G>
      {rooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          selected={selectedRoom === room.id}
          onPress={onRoomClick}
          labelScale={labelScale}
        />
      ))}
    </G>
  );
}