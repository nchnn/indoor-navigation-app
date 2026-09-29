import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { nodeById } from '../../data/old.dorm3F';
import type { useLiveTracking } from '../../hooks/useLiveTracking';
import { theme } from '../../theme';
import Icon from '../common/Icon';

type Live = ReturnType<typeof useLiveTracking>;

interface Props {
  live: Live;
  originId: string | null;
  onRequestAnchor(): string | null; // returns node id to anchor on (origin)
}

export default function LiveTracker({ live, originId, onRequestAnchor }: Props) {
  const [open, setOpen] = useState(false);

  const anchorName = live.anchorId ? nodeById(live.anchorId)?.short ?? '?' : '--';
  const status = !live.running
    ? 'Live tracking off'
    : live.mode === 'gps'
      ? live.gps
        ? `GPS ±${live.gps.acc == null ? '?' : Math.round(live.gps.acc)}m${live.gpsWeak ? ' · weak indoors' : ''}`
        : 'Waiting for GPS fix...'
      : `Foot · ${live.steps} steps${live.heading != null ? ` · H${live.heading}°` : ''}`;

  const dotColor = !live.running
    ? theme.colors.inkSubtle
    : live.mode === 'gps' && live.gpsWeak
      ? theme.colors.warning
      : theme.colors.success;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {!open ? (
        <Pressable style={[styles.fab, live.running && styles.fabOn]} onPress={() => setOpen(true)}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.fabTxt, live.running && { color: theme.colors.canvas }]}>LIVE</Text>
        </Pressable>
      ) : (
        <View style={[styles.card, theme.shadow.card]}>
          <View style={styles.headRow}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <Text style={styles.status} numberOfLines={1}>{status}</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={10}>
              <Icon name="x" size={14} color={theme.colors.inkSubtle} />
            </Pressable>
          </View>
          <Text style={styles.anchor}>Anchored: {anchorName}{live.snapM != null && live.running ? ` · on-path ±${live.snapM.toFixed(1)}m` : ''}</Text>
          {live.gpsError && <Text style={styles.err}>{live.gpsError}</Text>}
          <View style={styles.btnRow}>
            {!live.running ? (
              <>
                <Pressable style={styles.goBtn} onPress={() => live.start('gps', onRequestAnchor() ?? undefined)}>
                  <View style={styles.btnContent}>
                    <Icon name="satellite" size={13} color={theme.colors.canvas} />
                    <Text style={styles.goTxt}>GPS</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.goBtn} onPress={() => live.start('steps', onRequestAnchor() ?? undefined)}>
                  <View style={styles.btnContent}>
                    <Icon name="footprints" size={13} color={theme.colors.canvas} />
                    <Text style={styles.goTxt}>Foot</Text>
                  </View>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.stopBtn} onPress={live.stop}>
                <View style={styles.btnContent}>
                  <Icon name="square" size={13} color={theme.colors.canvas} />
                  <Text style={styles.goTxt}>Stop</Text>
                </View>
              </Pressable>
            )}
            <Pressable
              style={styles.hereBtn}
              onPress={() => {
                const id = onRequestAnchor() ?? originId;
                if (id) live.iamHere(id);
              }}
            >
              <View style={styles.btnContent}>
                <Icon name="map-pin" size={13} color={theme.colors.ink} />
                <Text style={styles.hereTxt}>I&apos;m here</Text>
              </View>
            </Pressable>
          </View>
          <Text style={styles.hint}>
            GPS is coarse indoors — Foot + I'm here at a checkpoint gives room accuracy. GPS offsets auto-calibrate on I'm here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 168, left: 14, zIndex: 9, maxWidth: '62%' },
  fab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.canvas, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 14,
    borderWidth: 1, borderColor: theme.colors.hairline,
    ...theme.shadow.lifted,
  },
  fabOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  fabTxt: { fontWeight: '900', fontSize: 12.5, letterSpacing: 1, color: theme.colors.ink },
  dot: { width: 9, height: 9, borderRadius: 5 },
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.radius.lg, padding: 12, borderWidth: 1, borderColor: theme.colors.hairline, ...theme.shadow.card },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  status: { flex: 1, fontWeight: '800', fontSize: 12.5, color: theme.colors.ink },
  anchor: { fontSize: 11.5, color: theme.colors.inkSubtle, marginTop: 3 },
  err: { fontSize: 11.5, color: theme.colors.error, marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 7, marginTop: 9 },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  goBtn: { backgroundColor: theme.colors.primary, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 13 },
  goTxt: { color: theme.colors.canvas, fontWeight: '800', fontSize: 12.5 },
  stopBtn: { backgroundColor: theme.colors.ink, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 13 },
  hereBtn: { backgroundColor: theme.colors.surface1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 13 },
  hereTxt: { color: theme.colors.ink, fontWeight: '800', fontSize: 12.5 },
  hint: { fontSize: 10.5, color: theme.colors.inkSubtle, marginTop: 8, lineHeight: 14 },
});
