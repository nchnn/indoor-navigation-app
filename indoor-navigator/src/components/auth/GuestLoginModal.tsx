/*
 * File: src/components/auth/GuestLoginModal.tsx
 * Guest name/nickname entry modal extracted from LoginView.
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

interface GuestLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function GuestLoginModal({ visible, onClose, onSubmit }: GuestLoginModalProps) {
  const [guestName, setGuestName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setGuestName('');
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = guestName.trim();
    if (!trimmed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setErrorMsg('Please enter your name or nickname to continue as guest.');
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
              <Icon name="compass" size={20} color={theme.colors.brandBlue} />
            </View>
            <View style={styles.modalHeaderTextCol}>
              <Text style={styles.modalTitle}>Continue as Guest</Text>
              <Text style={styles.modalSubtitle}>Enter your name or nickname to proceed</Text>
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

          <Text style={styles.inputLabel}>Name or Nickname</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Alex or Visitor"
            placeholderTextColor={theme.colors.inkTertiary}
            value={guestName}
            onChangeText={(t) => {
              setGuestName(t);
              if (errorMsg) setErrorMsg('');
            }}
            autoCapitalize="words"
            autoFocus
          />

          <Pressable style={styles.modalActionBtn} onPress={handleSubmit}>
            <Icon name="chevron-right" size={18} color={theme.colors.canvas} />
            <Text style={styles.modalActionBtnText}>Enter Dashboard as Guest</Text>
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
