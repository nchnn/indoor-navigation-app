import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import RoomCell from './RoomCell';
import type { Floor } from '../../types/floor';
import { theme } from '../../theme';

interface Props {
  floor: Floor;
  selectedId?: string | null;
  onRoomPress?(id: string): void;
}

export default function FloorPlan({ floor, selectedId, onRoomPress }: Props) {
  const slabX = 15;
  const slabY = 15;
  const slabW = floor.width - 30;
  const slabH = floor.height - 30;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${floor.width} ${floor.height}`}>
        {/* Elevation shadow layers (stacked soft rects behind the slab) */}
        <Rect x={slabX + 6} y={slabY + 8}  width={slabW} height={slabH} rx={20} fill="rgba(26,26,46,0.06)" />
        <Rect x={slabX + 4} y={slabY + 5}  width={slabW} height={slabH} rx={19} fill="rgba(26,26,46,0.05)" />
        <Rect x={slabX + 2} y={slabY + 3}  width={slabW} height={slabH} rx={18} fill="rgba(26,26,46,0.04)" />

        {/* Building perimeter slab */}
        <Rect
          x={slabX} y={slabY}
          width={slabW} height={slabH}
          rx={18}
          fill={theme.colors.canvas}
          stroke={theme.colors.hairlineStrong}
          strokeWidth={3}
        />

        {floor.hallways.map((h, i) => (
          <React.Fragment key={i}>
            <Rect x={h.x} y={h.y} width={h.w} height={h.h} rx={8} fill={theme.colors.hallway} />
            <Line
              x1={h.x + 4} x2={h.x + h.w - 4}
              y1={h.y + h.h / 2} y2={h.y + h.h / 2}
              stroke={theme.colors.hairlineStrong}
              strokeWidth={2.5}
              strokeDasharray={[10, 8]}
            />
          </React.Fragment>
        ))}

        {floor.rooms.map((r) => (
          <RoomCell
            key={r.id}
            x={r.x} y={r.y} width={r.w} height={r.h}
            label={r.label}
            sub={r.sub}
            facing={r.facing}
            doorWidth={r.doorWidth}
            active={r.id === selectedId}
            onPress={() => onRoomPress?.(r.id)}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', backgroundColor: 'transparent' },
});