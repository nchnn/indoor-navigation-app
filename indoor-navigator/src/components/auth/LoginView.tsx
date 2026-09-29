/*
 * File: src/components/auth/LoginView.tsx
 * Full-screen login/landing page for the Indoor Navigator.
 * Composes the hero branding, login actions, and delegates
 * modal behavior to EduLoginModal and GuestLoginModal.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from '../common/Icon';
import EduLoginModal from './EduLoginModal';
import GuestLoginModal from './GuestLoginModal';
import { theme } from '../../theme';

interface LoginViewProps {
  onLoginEdu: (email: string) => void;
  onLoginGuest: (name: string) => void;
}

export default function LoginView({ onLoginEdu, onLoginGuest }: LoginViewProps) {
  const [eduModalVisible, setEduModalVisible] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);

  const handleOpenEdu = () => {
    Haptics.selectionAsync().catch(() => {});
    setEduModalVisible(true);
  };

  const handleOpenGuest = () => {
    Haptics.selectionAsync().catch(() => {});
    setGuestModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
  

        {/* ── Hero / Branding Center ── */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadgeWrap}>
            <View style={styles.logoBadge}>
              <Icon name="navigation" size={26} color={theme.colors.canvas} />
            </View>
            <View style={styles.logoFloorPill}>
              <Text style={styles.logoFloorPillText}>L3 · INDOOR</Text>
            </View>
          </View>

          <View style={styles.schoolTag}>
            <Icon name="building" size={14} color={theme.colors.brandBlue} />
            <Text style={styles.schoolTagText}>New Era University</Text>
          </View>

          <Text style={styles.headline}>Campus Wayfinder</Text>

          <Text style={styles.heroDesc}>
            High-precision 2D & 3D indoor positioning, dynamic lecture hall routes, and accessible multi-floor guidance.
          </Text>
        </View>

        {/* ── Metrics / Feature Badges Bar ── */}
        <View style={styles.metricsCard}>
          <View style={styles.metricCol}>
            <Icon name="navigation" size={18} color={theme.colors.brandBlue} />
            <Text style={styles.metricValue}>Real-Time</Text>
            <Text style={styles.metricSub}>Sub-meter GPS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Icon name="building" size={18} color={theme.colors.brandBlue} />
            <Text style={styles.metricValue}>4 Buildings</Text>
            <Text style={styles.metricSub}>B1 through L5</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Icon name="accessibility" size={18} color={theme.colors.brandBlue} />
            <Text style={styles.metricValue}>Step-Free</Text>
            <Text style={styles.metricSub}>Elevator sync</Text>
          </View>
        </View>

        {/* ── Primary Action: Institutional Email Login ── */}
        <View style={styles.loginSection}>
          <Pressable style={styles.googleLoginBtn} onPress={handleOpenEdu}>
            <View style={styles.googleIconCircle}>
              <Icon name="google" size={18} color={theme.colors.canvas} />
            </View>
            <View style={styles.googleLoginTextCol}>
              <Text style={styles.googleLoginTitle}>Institutional Email</Text>
              <Text style={styles.googleLoginSubtitle}>@neu.edu.ph</Text>
            </View>
            <Icon name="arrow-right" size={20} color={theme.colors.canvas} />
          </Pressable>

          <View style={styles.ssoBadge}>
            <Icon name="lock" size={13} color={theme.colors.inkSubtle} />
            <Text style={styles.ssoBadgeText}>Single Sign-On (SSO) Encrypted Identity</Text>
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR EXPLORE FREELY</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Guest Access Card ── */}
        <Pressable style={styles.guestCard} onPress={handleOpenGuest}>
          <View style={styles.guestIconBox}>
            <Icon name="compass" size={22} color={theme.colors.brandBlue} />
          </View>
          <View style={styles.guestTextCol}>
            <View style={styles.guestTitleRow}>
              <Text style={styles.guestTitle}>Continue as Campus Guest</Text>
              <View style={styles.noLoginBadge}>
                <Text style={styles.noLoginBadgeText}>No Login</Text>
              </View>
            </View>
            <Text style={styles.guestSub}>
              Instant map access for visitors, parents & seminars
            </Text>
          </View>
          <Icon name="chevron-right" size={18} color={theme.colors.inkSubtle} />
        </Pressable>

        {/* ── Feature Comparison Row ── */}
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Icon name="graduation-cap" size={16} color={theme.colors.brandBlue} />
              <Text style={styles.studentFacultyTitle}>Student / Faculty</Text>
            </View>
            {['Auto-synced class route', 'Faculty office directory', 'Personal locker locator'].map((b) => (
              <View key={b} style={styles.benefitItem}>
                <Icon name="check" size={13} color={theme.colors.inkMuted} />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Icon name="eye" size={16} color={theme.colors.accentAmber} />
              <Text style={styles.guestAccessTitle}>Guest Access</Text>
            </View>
            {['Public floor geometries', 'Auditorium & cafe paths', 'Visitor parking guide'].map((b) => (
              <View key={b} style={styles.benefitItem}>
                <Icon name="check" size={13} color={theme.colors.inkMuted} />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerWrap}>
          <View style={styles.safetyRow}>
            <Icon name="shield-check" size={14} color={theme.colors.inkMuted} />
            <Text style={styles.safetyText}>
              New Era University Spatial Mapping & Safety Services
            </Text>
          </View>
          <View style={styles.footerLinksRow}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerDot}>·</Text>
            <Text style={styles.footerLink}>Terms of Use</Text>
            <Text style={styles.footerDot}>·</Text>
            <Text style={styles.footerLink}>Campus Accessibility</Text>
          </View>
          <Text style={styles.buildText}>Build 2.4.0-SPATIAL · NEU Geo-Engine v4</Text>
        </View>
      </ScrollView>

      {/* ── Modals ── */}
      <EduLoginModal
        visible={eduModalVisible}
        onClose={() => setEduModalVisible(false)}
        onSubmit={onLoginEdu}
      />
      <GuestLoginModal
        visible={guestModalVisible}
        onClose={() => setGuestModalVisible(false)}
        onSubmit={onLoginGuest}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.canvas },
  scrollView: { flex: 1 },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  networkBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 5, paddingHorizontal: 10,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.pill, borderWidth: 1, borderColor: theme.colors.hairline,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.brandBlue },
  networkBadgeText: { fontSize: 10.5, fontWeight: '700', color: theme.colors.brandBlue, letterSpacing: 0.5 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  circleActionBtn: {
    width: 34, height: 34, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface1, borderWidth: 1, borderColor: theme.colors.hairline,
    alignItems: 'center', justifyContent: 'center',
  },
  heroSection: { alignItems: 'center', paddingVertical: theme.spacing.xs, gap: theme.spacing.xs },
  logoBadgeWrap: { alignItems: 'center', marginBottom: 4 },
  logoBadge: {
    width: 58, height: 58, borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.brandBlue, alignItems: 'center', justifyContent: 'center',
    ...theme.shadow.card,
  },
  logoFloorPill: {
    marginTop: -10, backgroundColor: theme.colors.ink,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: theme.radius.pill, borderWidth: 1, borderColor: theme.colors.canvas,
  },
  logoFloorPillText: { fontSize: 9.5, fontWeight: '800', color: theme.colors.canvas, letterSpacing: 0.8 },
  schoolTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: theme.colors.brandBlueSoft,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.pill,
  },
  schoolTagText: { fontSize: 12, fontWeight: '700', color: theme.colors.brandBlue, letterSpacing: 0.2 },
  headline: { fontSize: 27, fontWeight: '800', color: theme.colors.ink, letterSpacing: -0.6, textAlign: 'center', marginTop: 2 },
  heroDesc: { fontSize: 12.5, color: theme.colors.inkMuted, textAlign: 'center', lineHeight: 18, maxWidth: 320 },
  metricsCard: {
    flexDirection: 'row', backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.hairline,
    paddingVertical: theme.spacing.sm, paddingHorizontal: 4,
  },
  metricCol: { flex: 1, alignItems: 'center', gap: 2 },
  metricValue: { fontSize: 12.5, fontWeight: '700', color: theme.colors.ink, marginTop: 2 },
  metricSub: { fontSize: 10, color: theme.colors.inkMuted },
  metricDivider: { width: 1, backgroundColor: theme.colors.hairline, height: '70%', alignSelf: 'center' },
  loginSection: { gap: theme.spacing.xs },
  googleLoginBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.brandBlue, borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md, paddingVertical: 14, gap: theme.spacing.sm,
    ...theme.shadow.card,
  },
  googleIconCircle: {
    width: 32, height: 32, borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.canvas, alignItems: 'center', justifyContent: 'center',
  },
  googleLoginTextCol: { flex: 1 },
  googleLoginTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.canvas, letterSpacing: -0.2 },
  googleLoginSubtitle: { fontSize: 11.5, color: theme.colors.brandBlueBorder, marginTop: 1 },
  ssoBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 2 },
  ssoBadgeText: { fontSize: 11, color: theme.colors.inkSubtle, letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginVertical: 2 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.hairline },
  dividerText: { fontSize: 10.5, fontWeight: '700', color: theme.colors.inkSubtle, letterSpacing: 1.2 },
  guestCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.canvas, borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.hairline,
    padding: theme.spacing.md, gap: theme.spacing.sm, ...theme.shadow.lifted,
  },
  guestIconBox: {
    width: 44, height: 44, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brandBlueSoft, alignItems: 'center', justifyContent: 'center',
  },
  guestTextCol: { flex: 1 },
  guestTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  guestTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.ink },
  noLoginBadge: { backgroundColor: theme.colors.brandBlueSoft, paddingHorizontal: 6, paddingVertical: 1, borderRadius: theme.radius.xs },
  noLoginBadgeText: { fontSize: 10, fontWeight: '700', color: theme.colors.brandBlue },
  guestSub: { fontSize: 11.5, color: theme.colors.inkMuted, lineHeight: 15 },
  comparisonRow: { flexDirection: 'row', gap: theme.spacing.sm },
  comparisonCard: {
    flex: 1, backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.hairline,
    padding: theme.spacing.sm, gap: 6,
  },
  comparisonHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  studentFacultyTitle: { fontSize: 11.5, fontWeight: '700', color: theme.colors.brandBlue, letterSpacing: 0.2 },
  guestAccessTitle: { fontSize: 11.5, fontWeight: '700', color: theme.colors.accentAmber, letterSpacing: 0.2 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  benefitText: { fontSize: 10.5, color: theme.colors.inkMuted, flex: 1 },
  footerWrap: { alignItems: 'center', gap: 6, marginTop: theme.spacing.xs },
  safetyRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  safetyText: { fontSize: 11, color: theme.colors.inkMuted, textAlign: 'center' },
  footerLinksRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLink: { fontSize: 10.5, color: theme.colors.inkSubtle },
  footerDot: { fontSize: 10, color: theme.colors.inkSubtle },
  buildText: { fontSize: 10, color: theme.colors.inkTertiary, letterSpacing: 0.3 },
});
