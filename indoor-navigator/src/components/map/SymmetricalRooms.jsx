import { G } from "react-native-svg";
import Room from "./Room";

export default function SymmetricalRooms({
  startX = 0,
  startY = 0,
  roomWidth = 100,
  roomHeight = 80,
  gap = 0,
  count = 1,
  startNumber = 101,
  direction = "horizontal",
  order = "ascending",
  selectedRoom,
  onRoomClick,
  labelScale = 1,
  door,              // default door for every room in this group
  doorOverrides,     // per-room changes, keyed by id: { M103: {...}, M105: null }
}) {
  // an override replaces the default door; null/false removes it
  const doorFor = (id) =>
    doorOverrides && id in doorOverrides ? doorOverrides[id] || undefined : door;

  const rooms = Array.from({ length: count }, (_, index) => {
    const number =
      order === "ascending"
        ? startNumber + index
        : startNumber + (count - 1 - index);

    let x = startX;
    let y = startY;

    if (direction === "horizontal") {
      x = startX + index * (roomWidth + gap);
    }

    if (direction === "vertical") {
      y = startY + index * (roomHeight + gap);
    }

    const id = `M${number}`;

    return {
      id,
      x,
      y,
      width: roomWidth,
      height: roomHeight,
      door: doorFor(id),
    };
  });

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