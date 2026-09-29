import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { formatDist, formatEta, type RouteStep } from '../../services/routing';
import Icon, { type IconName } from '../common/Icon';

const ICONS: Record<RouteStep['icon'], IconName> = {
  start: 'map-pin',
  straight: 'arrow-up',
  left: 'arrow-left',
  right: 'arrow-right',
  arrive: 'flag',
};

interface Props {
  distanceM: number;
  etaSec: number;
  steps: RouteStep[];
  activeStep: number;
  simulating: boolean;
  speed: 1 | 2;
  onToggleSim(): void;
  onSpeed(): void;
  onCancel(): void;
}

export default function RouteCard(p: Props) {
  const stepCount = p.steps?.length ?? 0;
  return (
    <View style={[styles.card, theme.shadow.card]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.dist}>{formatDist(p.distanceM)}</Text>
          <Text style={styles.eta}>~{formatEta(p.etaSec)} walk · {stepCount} steps</Text>
        </View>
        <View style={styles.btnRow}>
          <Pressable style={[styles.simBtn, p.simulating && styles.simOn]} onPress={p.onToggleSim}>
            <Text style={[styles.simTxt, p.simulating && { color: theme.colors.canvas }]}>
              {p.simulating ? <><Icon name="pause" size={13} color={theme.colors.canvas} /> Pause</> : <><Icon name="play" size={13} color={theme.colors.primaryFocus} /> Walk</>}
            </Text>
          </Pressable>
          <Pressable style={styles.chipBtn} onPress={p.onSpeed}>
            <Text style={styles.chipTxt}>{p.speed}x</Text>
          </Pressable>
          <Pressable style={styles.chipBtn} onPress={p.onCancel}>
            <Text style={styles.chipTxt}>End</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, (p.activeStep / Math.max(1, stepCount - 1)) * 100))}%` }]} />
      </View>
      <Text style={styles.hint}>Pink dashed line = shortest hallway path · auto-reroutes if you move</Text>
    </View>
  );
}

export function TurnByTurn({ steps, activeStep }: { steps: RouteStep[]; activeStep: number }) {
  const safeSteps = steps ?? [];
  return (
    <View style={styles.steps}>
      {safeSteps.map((s, i) => {
        const active = i === activeStep;
        const done = i < activeStep;
        return (
          <View key={s.key} style={[styles.step, active && styles.stepActive, done && styles.stepDone]}>
            <Icon name={ICONS[s.icon]} size={20} color={active ? theme.colors.primaryFocus : theme.colors.ink} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepTxt, active && { color: theme.colors.primaryFocus }]}>{s.text}</Text>
              <Text style={styles.stepSub}>{s.sub}</Text>
            </View>
            {active && <View style={styles.nowDot} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.radius.lg, padding: 13, borderWidth: 1, borderColor: theme.colors.hairline },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dist: { fontSize: 24, fontWeight: '900', color: theme.colors.ink },
  eta: { fontSize: 12.5, color: theme.colors.inkSubtle, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  simBtn: { backgroundColor: theme.colors.primarySoft, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 14 },
  simOn: { backgroundColor: theme.colors.primary },
  simTxt: { fontWeight: '800', color: theme.colors.primaryFocus, fontSize: 13 },
  chipBtn: { backgroundColor: theme.colors.surface1, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 12 },
  chipTxt: { fontWeight: '800', color: theme.colors.ink, fontSize: 13 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: theme.colors.surface1, marginTop: 11, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: theme.colors.primary, borderRadius: 3 },
  hint: { fontSize: 11, color: theme.colors.inkSubtle, marginTop: 7 },
  steps: { gap: 8, marginTop: 10 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: theme.colors.canvas, borderRadius: 14, padding: 11, borderWidth: 1, borderColor: theme.colors.hairline },
  stepActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
  stepDone: { opacity: 0.6 },

  stepTxt: { fontWeight: '800', color: theme.colors.ink, fontSize: 13.5 },
  stepSub: { color: theme.colors.inkSubtle, fontSize: 12, marginTop: 1 },
  nowDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary },
});
