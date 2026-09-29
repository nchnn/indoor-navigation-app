/*
 * File: src/components/auth/EduLoginModal.tsx
 * Institutional Email sign-in modal extracted from LoginView.
 * Handles @neu.edu.ph domain validation and submission.
 */

import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from '../common/Icon';
import { theme } from '../../theme';

interface EduLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function EduLoginModal({ visible, onClose, onSubmit }: EduLoginModalProps) {
  const [eduEmail, setEduEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setEduEmail('');
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = () => {
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
    onSubmit(trimmed);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalDismiss} onPress={handleClose} />
        <View style={styles.modalDialog}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIconBox}>
              <Icon name="shield-check" size={20} color={theme.colors.brandBlue} />
            </View>
            <View style={styles.modalHeaderTextCol}>
              <Text style={styles.modalTitle}>Institutional Email</Text>
              <Text style={styles.modalSubtitle}>Sign in with your @neu.edu.ph account</Text>
            </View>
            <Pressable style={styles.modalCloseBtn} onPress={handleClose}>
              <Icon name="x" size={18} color={theme.colors.inkSubtle} />
            </Pressable>
          </View>

          {!!errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <Text style={styles.inputLabel}>NEU Institutional Email</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="username@neu.edu.ph"
            placeholderTextColor={theme.colors.inkTertiary}
            value={eduEmail}
            onChangeText={(t) => {
              setEduEmail(t);
              if (errorMsg) setErrorMsg('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoFocus
          />

          <Pressable style={styles.modalActionBtn} onPress={handleSubmit}>
            <Icon name="log-in" size={18} color={theme.colors.canvas} />
            <Text style={styles.modalActionBtnText}>Verify & Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.canvas,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    gap: theme.spacing.sm,
    ...theme.shadow.card,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  modalIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brandBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTextCol: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink,
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: theme.colors.inkMuted,
  },
  modalCloseBtn: {
    padding: 4,
  },
  errorBox: {
    backgroundColor: theme.colors.surface2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.error,
  },
  errorText: {
    fontSize: 11.5,
    color: theme.colors.error,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  modalInput: {
    height: 46,
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.ink,
  },
  modalActionBtn: {
    height: 46,
    backgroundColor: theme.colors.brandBlue,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  modalActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.canvas,
  },
});
