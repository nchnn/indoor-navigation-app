/*
 * File: src/components/dashboard/DashboardView.tsx
 * Dashboard compositor. Composes DashboardHeader, SearchBar,
 * Quick Shortcuts, Features, and Map Launch CTA sections.
 */

import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from '../common/Icon';
import DashboardHeader from './DashboardHeader';
import SearchBar from './SearchBar';
import { type UserProfile } from '../../types/user';
import { QUICK_SHORTCUTS } from '../../constants/shortcuts';
import { FEATURES_LIST } from '../../constants/features';
import { theme } from '../../theme';

interface DashboardViewProps {
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  onOpenMap: () => void;
  onSelectDestination: (nodeId: string) => void;
}

export default function DashboardView({
  userProfile,
  onOpenAuth,
  onOpenMap,
  onSelectDestination,
}: DashboardViewProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header ── */}
      <DashboardHeader userProfile={userProfile} onOpenAuth={onOpenAuth} />

      {/* ── Search Bar ── */}
      <SearchBar onSelectDestination={onSelectDestination} />

      {/* ── Quick Shortcuts ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Shortcuts</Text>
          <Text style={styles.sectionBadge}>Direct Route</Text>
        </View>
        <View style={styles.shortcutsGrid}>
          {QUICK_SHORTCUTS.map((sc) => (
            <Pressable
              key={sc.id}
              style={styles.shortcutCard}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onSelectDestination(sc.id);
              }}
            >
              <View style={styles.shortcutIconCircle}>
                <Icon name={sc.icon} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.shortcutTextCol}>
                <Text style={styles.shortcutName} numberOfLines={1}>{sc.name}</Text>
                <Text style={styles.shortcutDetail} numberOfLines={1}>{sc.detail}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={theme.colors.inkSubtle} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Features ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.sectionBadge}>System Capabilities</Text>
        </View>
        <View style={styles.featuresStack}>
          {FEATURES_LIST.map((feat, idx) => (
            <View key={idx} style={styles.featureCard}>
              <View style={styles.featureIconBox}>
                <Icon name={feat.icon} size={20} color={theme.colors.ink} />
              </View>
              <View style={styles.featureContent}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>{feat.title}</Text>
                  <View style={styles.featureTag}>
                    <Text style={styles.featureTagText}>{feat.tag}</Text>
                  </View>
                </View>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Map Launch CTA ── */}
      <View style={styles.footerSection}>
        <Pressable
          style={styles.launchMapBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            onOpenMap();
          }}
        >
          <Icon name="map" size={18} color={theme.colors.canvas} />
          <Text style={styles.launchMapBtnText}>Explore Interactive Map</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.canvas },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  section: { gap: theme.spacing.xs },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.ink, letterSpacing: -0.2 },
  sectionBadge: { fontSize: 11, fontWeight: '600', color: theme.colors.inkSubtle, textTransform: 'uppercase', letterSpacing: 0.5 },
  shortcutsGrid: { gap: theme.spacing.xs },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface1,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    gap: theme.spacing.sm,
  },
  shortcutIconCircle: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutTextCol: { flex: 1 },
  shortcutName: { fontSize: 13, fontWeight: '600', color: theme.colors.ink, marginBottom: 2 },
  shortcutDetail: { fontSize: 11, color: theme.colors.inkMuted },
  featuresStack: { gap: theme.spacing.xs },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface1,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.hairlineTertiary,
  },
  featureContent: { flex: 1 },
  featureTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  featureTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.ink },
  featureTag: { backgroundColor: theme.colors.surface3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: theme.radius.xs },
  featureTagText: { fontSize: 10, fontWeight: '600', color: theme.colors.inkMuted, textTransform: 'uppercase' },
  featureDesc: { fontSize: 12, color: theme.colors.inkMuted, lineHeight: 16 },
  footerSection: { marginTop: theme.spacing.xs },
  launchMapBtn: {
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  launchMapBtnText: { fontSize: 14, fontWeight: '700', color: theme.colors.canvas },
});
