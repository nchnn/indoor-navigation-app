import { Rect } from "react-native-svg";

export default function OpenToBelow({
  x = 0,
  y = 0,
  width = 200,
  height = 150
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="none"
    />
  );
}