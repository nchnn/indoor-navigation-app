import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '../common/Icon';
import { theme } from '../../theme';

interface Props {
  compassDeg: number;
  onZoomIn(): void;
  onZoomOut(): void;
  onRecenter(): void;
  onResetNorth(): void;
  following: boolean;
  onToggleFollow(): void;
}

export default function MapControls(p: Props) {
  const norm = ((p.compassDeg % 360) + 360) % 360;
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable style={styles.btn} onPress={p.onZoomIn} accessibilityLabel="Zoom in">
        <Icon name="plus" size={20} color={theme.colors.ink} />
      </Pressable>
      <Pressable style={styles.btn} onPress={p.onZoomOut} accessibilityLabel="Zoom out">
        <Icon name="minus" size={20} color={theme.colors.ink} />
      </Pressable>
      <Pressable style={styles.btn} onPress={p.onResetNorth} accessibilityLabel="Reset rotation">
        <Text style={styles.compassTxt}>N {Math.round(norm)}</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={p.onRecenter} accessibilityLabel="Recenter map">
        <Icon name="locate" size={20} color={theme.colors.ink} />
      </Pressable>
      <Pressable
        style={[styles.btn, p.following && styles.followOn]}
        onPress={p.onToggleFollow}
        accessibilityLabel="Toggle follow mode"
      >
        <Icon
          name="navigation"
          size={18}
          color={p.following ? theme.colors.canvas : theme.colors.ink}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 12, top: 210, gap: 8, zIndex: 9, alignItems: 'center' },
  btn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.canvas,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.hairline,
    ...theme.shadow.lifted,
  },
  compassTxt: { fontSize: 11, fontWeight: '800', color: theme.colors.ink },
  followOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
});
