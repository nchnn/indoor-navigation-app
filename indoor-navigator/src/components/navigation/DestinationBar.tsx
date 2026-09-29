import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import Icon from '../common/Icon';

interface Props {
  originName: string;
  destName: string;
  hasRoute: boolean;
  onOpenSheet(): void;
  onSwap(): void;
  onClear(): void;
  onBackToDashboard?(): void;
}

export default function DestinationBar({ originName, destName, hasRoute, onOpenSheet, onSwap, onClear, onBackToDashboard }: Props) {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        style={[styles.card, theme.shadow.card]}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onOpenSheet();
        }}
      >
        <View style={styles.row}>
          {onBackToDashboard && (
            <Pressable
              style={styles.iconBtn}
              onPress={(e) => {
                e.stopPropagation();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onBackToDashboard();
              }}
              accessibilityLabel="Back to Dashboard"
            >
              <Icon name="arrow-left" size={17} color={theme.colors.ink} />
            </Pressable>
          )}
          <View style={styles.badge}>
            <Icon name="crosshair" size={22} color={theme.colors.primaryFocus} />
          </View>
          <View style={styles.txts}>
            <Text style={styles.kicker}>Destination</Text>
            <Text style={styles.dest} numberOfLines={1}>
              {destName}
            </Text>
            <Text style={styles.origin} numberOfLines={1}>
              From · {originName}
            </Text>
          </View>
          <Pressable
            style={styles.iconBtn}
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onSwap();
            }}
            accessibilityLabel="Swap origin and destination"
          >
            <Icon name="arrow-left-right" size={17} color={theme.colors.ink} />
          </Pressable>
          {hasRoute && (
            <Pressable
              style={styles.iconBtn}
              onPress={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              <Icon name="x" size={17} color={theme.colors.ink} />
            </Pressable>
          )}
        </View>
        {hasRoute && (
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTxt}>LIVE ROUTE · tap map checkpoints to move mid-flight</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 10, left: 14, right: 14, zIndex: 10 },
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.radius.lg, padding: 12, borderWidth: 1, borderColor: theme.colors.hairline },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  txts: { flex: 1 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: theme.colors.primaryFocus, textTransform: 'uppercase' },
  dest: { fontSize: 19, fontWeight: '800', color: theme.colors.ink },
  origin: { fontSize: 12.5, color: theme.colors.inkSubtle, marginTop: 1 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.surface1, alignItems: 'center', justifyContent: 'center' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: theme.colors.primarySoft, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 9 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
  liveTxt: { fontSize: 10.5, fontWeight: '800', color: theme.colors.primaryFocus, letterSpacing: 0.4 },
});
