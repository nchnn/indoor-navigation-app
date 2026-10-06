import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { theme } from '../../theme';

function SegButton({ active, label, onPress, testID }) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.segBtn, active && styles.segBtnActive]}
    >
      <Text style={[styles.segText, active && styles.segTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ToolButton({
  active,
  label,
  onPress,
  danger = false,
  icon,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.toolBtn,
        active && styles.toolBtnActive,
        danger && active && styles.toolBtnDanger,
      ]}
    >
      {icon && (
        <Text
          style={[
            styles.toolIcon,
            active && styles.toolIconActive,
            danger && active && styles.toolIconDanger,
          ]}
        >
          {icon}
        </Text>
      )}

      <Text
        style={[
          styles.toolText,
          active && styles.toolTextActive,
          danger && active && styles.toolTextDanger,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function AddOption({ icon, title, description, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.addOption}
    >
      <View style={styles.addIconBox}>
        <Text style={styles.addIcon}>{icon}</Text>
      </View>

      <View style={styles.addOptionText}>
        <Text style={styles.addOptionTitle}>{title}</Text>
        <Text style={styles.addOptionDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.addArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function EditToolbar({
  mode,
  onModeChange,
  tool,
  onToolChange,
  onAdd,
  onAddKind,
  addKind = 'room',
  onReset,
  dirty,
}) {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const edit = mode === 'edit';

  const add = (kind) => {
    setAddModalVisible(false);

    if (onAddKind) {
      onAddKind(kind);
    } else {
      onToolChange('add');
      onAdd?.();
    }
  };

  const openAdd = () => {
    setAddModalVisible(true);
  };

  const closeAdd = () => {
    setAddModalVisible(false);
  };

  const openMore = () => {
    onReset?.();
  };

  return (
    <>
      <View style={styles.wrap} pointerEvents="box-none">
        <View style={styles.card}>

          {/* VIEW / EDIT */}
          <View style={styles.seg}>
            <SegButton
              active={!edit}
              label="View"
              onPress={() => onModeChange('view')}
              testID="mode-view"
            />

            <SegButton
              active={edit}
              label="Edit"
              onPress={() => onModeChange('edit')}
              testID="mode-edit"
            />
          </View>

          {edit && (
            <>
              {/* MAIN TOOLS */}
              <View style={styles.tools}>

                <ToolButton
                  active={tool === 'select'}
                  label="Select"
                  icon="⌁"
                  onPress={() => onToolChange('select')}
                />

                <ToolButton
                  active={tool === 'add'}
                  label="Add"
                  icon="+"
                  onPress={openAdd}
                />

                <ToolButton
                  active={tool === 'erase'}
                  label="Erase"
                  icon="⌫"
                  danger
                  onPress={() => onToolChange('erase')}
                />

                <TouchableOpacity
                  onPress={openMore}
                  activeOpacity={0.75}
                  style={styles.moreBtn}
                >
                  <Text style={styles.moreIcon}>•••</Text>
                </TouchableOpacity>

              </View>

              {/* STATUS / HINT */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    dirty
                      ? styles.statusDotUnsaved
                      : styles.statusDotSaved,
                  ]}
                />

                <Text
                  numberOfLines={1}
                  style={styles.hint}
                >
                  {tool === 'add' &&
                    `Tap to place ${
                      addKind === 'cr'
                        ? 'a CR'
                        : addKind === 'stair'
                        ? 'a stair'
                        : 'a room'
                    }.`}

                  {tool === 'select' &&
                    'Tap an item to select · drag to move · resize handles · double-tap an edge to duplicate.'}

                  {tool === 'erase' &&
                    'Tap an item to remove it.'}

                  {!tool && 'Choose an editing tool.'}
                </Text>

                <Text style={styles.saveState}>
                  {dirty ? 'Unsaved' : 'Saved'}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ADD MODAL */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAdd}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={closeAdd}
        >
          <Pressable
            style={styles.addModal}
            onPress={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Add to Floor Plan
                </Text>

                <Text style={styles.modalSubtitle}>
                  Choose what you want to place
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeAdd}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* OPTIONS */}
            <View style={styles.addOptions}>

              <AddOption
                icon="□"
                title="Room"
                description="Add a classroom or room"
                onPress={() => add('room')}
              />

              <AddOption
                icon="WC"
                title="Comfort Room"
                description="Add a male or female CR"
                onPress={() => add('cr')}
              />

              <AddOption
                icon="⇅"
                title="Stair"
                description="Add an indoor staircase"
                onPress={() => add('stair')}
              />

            </View>

            {/* CANCEL */}
            <TouchableOpacity
              onPress={closeAdd}
              activeOpacity={0.7}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /*
   * TOOLBAR
   */
  wrap: {
    position: 'absolute',
    top: 76,
    left: 10,
    right: 10,
    zIndex: 50,
  },

  card: {
    backgroundColor: theme.colors.canvas,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    padding: 8,

    ...theme.shadow.lifted,
  },

  /*
   * VIEW / EDIT
   */
  seg: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.pill,
    padding: 3,
    gap: 3,
  },

  segBtn: {
    flex: 1,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },

  segBtnActive: {
    backgroundColor: theme.colors.canvas,
    ...theme.shadow.lifted,
  },

  segText: {
    color: theme.colors.inkSubtle,
    fontSize: 12,
    fontWeight: '800',
  },

  segTextActive: {
    color: theme.colors.ink,
  },

  /*
   * MAIN TOOLS
   */
  tools: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },

  toolBtn: {
    flex: 1,
    minWidth: 0,
    height: 38,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surface1,

    borderWidth: 1,
    borderColor: theme.colors.hairlineTertiary,
  },

  toolBtnActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryFocus,
  },

  toolBtnDanger: {
    backgroundColor: '#FDE8E8',
    borderColor: theme.colors.error,
  },

  toolIcon: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    fontWeight: '900',
  },

  toolIconActive: {
    color: theme.colors.primaryFocus,
  },

  toolIconDanger: {
    color: theme.colors.error,
  },

  toolText: {
    color: theme.colors.inkMuted,
    fontSize: 11,
    fontWeight: '800',
  },

  toolTextActive: {
    color: theme.colors.primaryFocus,
  },

  toolTextDanger: {
    color: theme.colors.error,
  },

  /*
   * MORE
   */
  moreBtn: {
    width: 42,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surface1,

    borderWidth: 1,
    borderColor: theme.colors.hairlineTertiary,
  },

  moreIcon: {
    color: theme.colors.inkSubtle,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },

  /*
   * STATUS
   */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 6,
    paddingHorizontal: 3,

    minWidth: 0,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusDotSaved: {
    backgroundColor: '#48A868',
  },

  statusDotUnsaved: {
    backgroundColor: '#E5A329',
  },

  hint: {
    flex: 1,

    color: theme.colors.inkSubtle,

    fontSize: 10,
    fontWeight: '600',
  },

  saveState: {
    marginLeft: 6,

    color: theme.colors.inkSubtle,

    fontSize: 9,
    fontWeight: '800',
  },

  /*
   * MODAL
   */
  modalOverlay: {
    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor: 'rgba(0, 0, 0, 0.35)',

    padding: 10,
  },

  addModal: {
    width: '100%',

    backgroundColor: theme.colors.canvas,

    borderRadius: theme.radius.lg,

    padding: 14,

    ...theme.shadow.lifted,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 12,
  },

  modalTitle: {
    color: theme.colors.ink,

    fontSize: 16,
    fontWeight: '900',
  },

  modalSubtitle: {
    color: theme.colors.inkSubtle,

    fontSize: 11,
    fontWeight: '600',

    marginTop: 2,
  },

  closeBtn: {
    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: theme.colors.surface2,
  },

  closeText: {
    color: theme.colors.inkMuted,

    fontSize: 23,
    fontWeight: '500',

    lineHeight: 25,
  },

  /*
   * ADD OPTIONS
   */
  addOptions: {
    gap: 7,
  },

  addOption: {
    minHeight: 60,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surface1,

    borderWidth: 1,
    borderColor: theme.colors.hairlineTertiary,
  },

  addIconBox: {
    width: 40,
    height: 40,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: theme.colors.primarySoft,
  },

  addIcon: {
    color: theme.colors.primaryFocus,

    fontSize: 17,
    fontWeight: '900',
  },

  addOptionText: {
    flex: 1,

    marginLeft: 10,
  },

  addOptionTitle: {
    color: theme.colors.ink,

    fontSize: 13,
    fontWeight: '900',
  },

  addOptionDescription: {
    color: theme.colors.inkSubtle,

    fontSize: 10,
    fontWeight: '600',

    marginTop: 2,
  },

  addArrow: {
    color: theme.colors.inkSubtle,

    fontSize: 24,
    fontWeight: '400',

    marginLeft: 8,
  },

  /*
   * CANCEL
   */
  cancelBtn: {
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 9,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surface2,
  },

  cancelText: {
    color: theme.colors.inkMuted,

    fontSize: 12,
    fontWeight: '800',
  },
});