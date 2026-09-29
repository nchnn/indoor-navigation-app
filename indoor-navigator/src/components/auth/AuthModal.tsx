/*
 * File: src/components/auth/AuthModal.tsx
 * In-app account profile / auth switch modal.
 * Moved from flat components/ to auth/ subfolder.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from '../common/Icon';
import { type UserProfile } from '../../types/user';
import { theme } from '../../theme';

interface AuthModalProps {
  visible: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onLoginEdu: (email: string) => void;
  onLoginGuest: (nickname: string) => void;
  onLogout: () => void;
}

export default function AuthModal({
  visible,
  currentUser,
  onClose,
  onLoginEdu,
  onLoginGuest,
  onLogout,
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'menu' | 'edu' | 'guest'>('menu');
  const [eduEmail, setEduEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetState = () => {
    setAuthMode('menu');
    setEduEmail('');
    setGuestName('');
    setErrorMsg('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const submitEdu = () => {
    const trimmed = eduEmail.trim().toLowerCase();
    const hasNeuEdu =
      trimmed.endsWith('@neu.edu.ph') ||
      trimmed.endsWith('.neu.edu.ph') ||
      trimmed.includes('@neu.edu.ph');
    if (!trimmed || !hasNeuEdu) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setErrorMsg('Institutional Email must be a valid @neu.edu.ph account.');
      return;
    }
    setErrorMsg('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onLoginEdu(trimmed);
    handleClose();
  };

  const submitGuest = () => {
    const trimmed = guestName.trim();
    if (!trimmed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setErrorMsg('Please enter your name or nickname to continue as guest.');
      return;
    }
    setErrorMsg('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onLoginGuest(trimmed);
    handleClose();
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onLogout();
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.scrim}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.scrimPressable} onPress={handleClose} />
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Icon
                  name={authMode === 'edu' ? 'shield-check' : authMode === 'guest' ? 'user' : 'sparkles'}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.cardTitle}>
                {currentUser && authMode === 'menu'
                  ? 'Account Profile'
                  : authMode === 'edu'
                  ? 'Institutional Google Sign-In'
                  : authMode === 'guest'
                  ? 'Guest Access'
                  : 'Access GuideMe'}
              </Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={handleClose} hitSlop={8}>
              <Icon name="x" size={18} color={theme.colors.inkSubtle} />
            </Pressable>
          </View>

          {/* Subtitle */}
          <Text style={styles.cardSubtitle}>
            {authMode === 'edu'
              ? 'Sign in using your school-issued Google account (.edu domain).'
              : authMode === 'guest'
              ? 'Pick a nickname. Guest users enjoy the exact same navigation powers.'
              : currentUser
              ? 'You are currently signed in. You have full access to all features.'
              : 'Choose how you would like to use the app. Sign-in is optional.'}
          </Text>

          {/* Error */}
          {!!errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Logged-in Menu */}
          {currentUser && authMode === 'menu' ? (
            <View style={styles.contentSection}>
              <View style={styles.activeProfileBox}>
                <View style={styles.avatarCircle}>
                  <Icon
                    name={currentUser.type === 'edu' ? 'shield-check' : 'user'}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileName}>{currentUser.name}</Text>
                  <Text style={styles.profileRole}>
                    {currentUser.type === 'edu'
                      ? `School (${currentUser.email})`
                      : 'Guest User'}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonStack}>
                <Pressable
                  style={styles.outlineBtn}
                  onPress={() => {
                    setErrorMsg('');
                    setAuthMode(currentUser.type === 'edu' ? 'guest' : 'edu');
                  }}
                >
                  <Icon
                    name={currentUser.type === 'edu' ? 'user' : 'shield-check'}
                    size={18}
                    color={theme.colors.ink}
                  />
                  <Text style={styles.outlineBtnText}>
                    {currentUser.type === 'edu' ? 'Switch to Guest Mode' : 'Switch to School Account'}
                  </Text>
                </Pressable>
                <Pressable style={styles.dangerBtn} onPress={handleLogout}>
                  <Icon name="log-out" size={18} color={theme.colors.error} />
                  <Text style={styles.dangerBtnText}>Sign Out / Clear Profile</Text>
                </Pressable>
              </View>
            </View>
          ) : authMode === 'edu' ? (
            <View style={styles.contentSection}>
              <Text style={styles.inputLabel}>School Email Address (.edu)</Text>
              <TextInput
                style={styles.input}
                placeholder="student@university.edu"
                placeholderTextColor={theme.colors.inkTertiary}
                value={eduEmail}
                onChangeText={(t) => { setEduEmail(t); if (errorMsg) setErrorMsg(''); }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
              <View style={styles.buttonStack}>
                <Pressable style={styles.primaryBtn} onPress={submitEdu}>
                  <Icon name="shield-check" size={18} color={theme.colors.canvas} />
                  <Text style={styles.primaryBtnText}>Verify & Sign In</Text>
                </Pressable>
                <Pressable style={styles.ghostBtn} onPress={() => { setErrorMsg(''); setAuthMode('menu'); }}>
                  <Text style={styles.ghostBtnText}>Back</Text>
                </Pressable>
              </View>
            </View>
          ) : authMode === 'guest' ? (
            <View style={styles.contentSection}>
              <Text style={styles.inputLabel}>Name or Nickname</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Alex or Visitor"
                placeholderTextColor={theme.colors.inkTertiary}
                value={guestName}
                onChangeText={(t) => { setGuestName(t); if (errorMsg) setErrorMsg(''); }}
                autoCapitalize="words"
                autoFocus
              />
              <View style={styles.buttonStack}>
                <Pressable style={styles.primaryBtn} onPress={submitGuest}>
                  <Icon name="user" size={18} color={theme.colors.canvas} />
                  <Text style={styles.primaryBtnText}>Continue as Guest</Text>
                </Pressable>
                <Pressable style={styles.ghostBtn} onPress={() => { setErrorMsg(''); setAuthMode('menu'); }}>
                  <Text style={styles.ghostBtnText}>Back</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.contentSection}>
              <Pressable style={styles.optionCard} onPress={() => { setErrorMsg(''); setAuthMode('edu'); }}>
                <View style={styles.optionIconBox}>
                  <Icon name="shield-check" size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionTitle}>School Google Account</Text>
                  <Text style={styles.optionDesc}>Sign in with an institutional .edu email</Text>
                </View>
                <Icon name="chevron-right" size={18} color={theme.colors.inkSubtle} />
              </Pressable>
              <Pressable style={styles.optionCard} onPress={() => { setErrorMsg(''); setAuthMode('guest'); }}>
                <View style={styles.optionIconBox}>
                  <Icon name="user" size={22} color={theme.colors.ink} />
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionTitle}>Continue as Guest</Text>
                  <Text style={styles.optionDesc}>Quick access with a nickname; identical features</Text>
                </View>
                <Icon name="chevron-right" size={18} color={theme.colors.inkSubtle} />
              </Pressable>
              <Pressable style={styles.ghostBtn} onPress={handleClose}>
                <Text style={styles.ghostBtnText}>Skip for now</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.md },
  scrimPressable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  card: { width: '100%', maxWidth: 420, backgroundColor: theme.colors.canvas, borderRadius: theme.radius.lg, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.hairline, ...theme.shadow.card },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, flex: 1 },
  iconCircle: { width: 32, height: 32, borderRadius: theme.radius.pill, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.ink, letterSpacing: -0.2 },
  closeBtn: { width: 28, height: 28, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.hairline },
  cardSubtitle: { fontSize: 13, color: theme.colors.inkMuted, lineHeight: 18, marginBottom: theme.spacing.md },
  errorBox: { backgroundColor: theme.colors.surface2, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.sm, marginBottom: theme.spacing.md, borderLeftWidth: 3, borderLeftColor: theme.colors.error },
  errorText: { fontSize: 12, color: theme.colors.error, fontWeight: '500' },
  contentSection: { gap: theme.spacing.sm },
  activeProfileBox: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, backgroundColor: theme.colors.surface1, padding: theme.spacing.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.hairline, marginBottom: theme.spacing.xs },
  avatarCircle: { width: 44, height: 44, borderRadius: theme.radius.pill, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  profileDetails: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: theme.colors.ink },
  profileRole: { fontSize: 12, color: theme.colors.inkMuted, marginTop: 2 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface1, padding: theme.spacing.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.hairline, gap: theme.spacing.sm },
  optionIconBox: { width: 38, height: 38, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.hairlineTertiary },
  optionTextCol: { flex: 1 },
  optionTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.ink, marginBottom: 2 },
  optionDesc: { fontSize: 12, color: theme.colors.inkMuted },
  inputLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.ink, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 46, borderWidth: 1, borderColor: theme.colors.hairlineStrong, backgroundColor: theme.colors.surface1, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, fontSize: 14, color: theme.colors.ink, marginBottom: theme.spacing.sm },
  buttonStack: { gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  primaryBtn: { height: 44, backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
  primaryBtnText: { fontSize: 14, fontWeight: '600', color: theme.colors.canvas },
  outlineBtn: { height: 44, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.hairlineStrong, backgroundColor: theme.colors.canvas, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: theme.colors.ink },
  dangerBtn: { height: 40, borderRadius: theme.radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
  dangerBtnText: { fontSize: 13, fontWeight: '600', color: theme.colors.error },
  ghostBtn: { height: 38, alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { fontSize: 13, fontWeight: '500', color: theme.colors.inkSubtle },
});
