/*
 * File: src/components/dashboard/DashboardHeader.tsx
 * Brand row + auth pill extracted from DashboardView.
 * Displays the app logo, name, and the current user's auth state.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from '../common/Icon';
import { type UserProfile } from '../../types/user';
import { theme } from '../../theme';

interface DashboardHeaderProps {
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
}

export default function DashboardHeader({ userProfile, onOpenAuth }: DashboardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Icon name="sparkles" size={18} color={theme.colors.canvas} />
        </View>
        <View>
          <Text style={styles.brandTitle}>GuideMe</Text>
          <Text style={styles.brandSubtitle}>Indoor Navigator - Level 3</Text>
        </View>
      </View>

      <Pressable
        style={styles.authPill}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onOpenAuth();
        }}
      >
        <Icon
          name={
            userProfile?.type === 'edu'
              ? 'shield-check'
              : userProfile?.type === 'guest'
              ? 'user'
              : 'log-in'
          }
          size={15}
          color={userProfile ? theme.colors.primary : theme.colors.inkMuted}
        />
        <Text
          style={[styles.authPillText, userProfile ? styles.authPillTextActive : null]}
          numberOfLines={1}
        >
          {userProfile
            ? userProfile.type === 'edu'
              ? userProfile.name
              : `Guest: ${userProfile.name}`
            : 'Sign In / Guest'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.ink,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: theme.colors.inkMuted,
    fontWeight: '500',
  },
  authPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    maxWidth: 160,
  },
  authPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.inkMuted,
  },
  authPillTextActive: {
    color: theme.colors.ink,
  },
});
