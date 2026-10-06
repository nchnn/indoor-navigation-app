import { StyleSheet } from "react-native";
import { Svg, Circle, Polygon, Rect, Text as SvgText } from "react-native-svg";
import SymmetricalRooms from "./SymmetricalRooms";
import CustomRooms from "./CustomRooms";
import OpenToBelow from "./OpenToBelow";
import { theme } from "../../theme";
import ComfortRoom from './ComfortRoom';
import Quadrangle from './Quadrangle';
import DoubleFlightStairs from './DoubleFlightStairs';

// ── Floor plan boundary ──
const FLOOR_W = 8000;
const FLOOR_H = 3500;

export default function FloorPlan({ zoom = 1 }) {
  // Counter-scale: zoom-out (zoom<1) -> text lumalaki, zoom-in -> text lumiliit.
  // Resulta: halos constant ang text sa screen, readable kahit zoomed-out.
  // Clamp para hindi sumabog sa sobrang zoom.
  const labelScale = Math.min(1, Math.max(0.5, 1 / Math.max(zoom, 0.2)));
  return (
    <Svg
      viewBox={`0 0 ${FLOOR_W} ${FLOOR_H}`}
      width={FLOOR_W}
      height={FLOOR_H}
      preserveAspectRatio="xMidYMid meet"
      style={[styles.wrapper, { width: FLOOR_W, height: FLOOR_H }]}
    >
          {/* ── Floor slab (visible boundary) ── */}
  
          

          {/* =========================
              NORTH ROOMS
              ========================= */}

          <SymmetricalRooms
            startX={380}
            startY={300}
            roomWidth={300}
            roomHeight={200}
            gap={0}
            count={5}
            startNumber={118}
            direction="horizontal"
            order="ascending"
            labelScale={labelScale}
          />

          <CustomRooms
            rooms={[
              {
                id: "M122",
                x: 3000,
                y: 300,
                width: 575,
                height: 300
              }
            ]}
            labelScale={labelScale}
          />


          {/* =========================
              SOUTH ROOMS
              ========================= */}

          <SymmetricalRooms
            startX={380}
            startY={1800}
            roomWidth={460}
            roomHeight={240}
            gap={0}
            count={6}
            startNumber={107}
            direction="vertical"
            order="descending"
            labelScale={labelScale}
          />


          {/* =========================
              CUSTOM ROOMS
              ========================= */}

          <CustomRooms
  rooms={[
    { id: 'M101', x: 0,   y: 0, width: 300, height: 640,
      door: { wall: 'bottom', hinge: 'left', swing: 'in' } },
    { id: 'M102', x: 500, y: 0, width: 300, height: 640,
      door: { wall: 'bottom', type: 'double' } },
  ]}
/>


          {/* =========================
              OPEN TO BELOW
              ========================= */}

          <SymmetricalRooms
            startX={0}
            startY={0}
            roomWidth={500}
            roomHeight={300}
            count={5}
            startNumber={107}
            order="descending"          // 111 on the left … 107 on the right
            direction="horizontal"
            door={[
              { wall: 'top', corner: 'right' },
              { wall: 'top', corner: 'left' },
            ]}
          />
                    
          <OpenToBelow
            x={1920}
            y={750}
            width={1150}
            height={750}
          />

           {/* Ground floor stair: no basement below → half-cut UP only (hasBelow={false}) */}
           <DoubleFlightStairs x={1500} y={1500} width={300} height={200} facing="right" upSide="left" hasBelow={false} />

            <ComfortRoom x={1550} y={900} width={150} height={250} doorPosition="topRight" type="female"/>

            <Quadrangle x={1500} y={1700} width={2000} height={900} />
      

    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    backgroundColor: theme.colors.canvas,
    shadowColor: theme.colors.ink,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});