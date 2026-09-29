/*
 * File: src/components/dashboard/SearchBar.tsx
 * Search input + live results dropdown extracted from DashboardView.
 * Handles its own search state and node filtering logic.
 */

import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon, { type IconName } from '../common/Icon';
import { NODES, type FloorNode } from '../../data/old.dorm3F';
import { theme } from '../../theme';

interface SearchBarProps {
  onSelectDestination: (nodeId: string) => void;
}

function getIconForNode(node: FloorNode): IconName {
  if (node.type === 'stairs') return 'stairs';
  if (node.type === 'facility') {
    if (node.id.includes('laundry')) return 'washing-machine';
    if (node.id.includes('study')) return 'book-open';
    if (node.id.includes('pantry')) return 'cooking-pot';
    return 'sparkles';
  }
  return 'bed-double';
}

export default function SearchBar({ onSelectDestination }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return NODES.filter((n) => {
      if (n.type === 'hallway' || n.type === 'corner') return false;
      return (
        n.name.toLowerCase().includes(q) ||
        n.short.toLowerCase().includes(q) ||
        (n.detail && n.detail.toLowerCase().includes(q)) ||
        n.group.toLowerCase().includes(q)
      );
    }).slice(0, 8);
  }, [searchQuery]);

  const handleSelect = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    Keyboard.dismiss();
    setSearchQuery('');
    onSelectDestination(id);
  };

  return (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <Icon name="search" size={18} color={theme.colors.inkSubtle} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search rooms, facilities, stairs..."
          placeholderTextColor={theme.colors.inkTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
        {!!searchQuery && (
          <Pressable style={styles.clearBtn} onPress={() => setSearchQuery('')} hitSlop={8}>
            <Icon name="x" size={16} color={theme.colors.inkSubtle} />
          </Pressable>
        )}
      </View>

      {filteredNodes.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredNodes.length} {filteredNodes.length === 1 ? 'place' : 'places'} found
            </Text>
          </View>
          {filteredNodes.map((node) => (
            <Pressable
              key={node.id}
              style={styles.resultItem}
              onPress={() => handleSelect(node.id)}
            >
              <View style={styles.resultIconBox}>
                <Icon name={getIconForNode(node)} size={16} color={theme.colors.primary} />
              </View>
              <View style={styles.resultTextBox}>
                <Text style={styles.resultTitle}>{node.name}</Text>
                <Text style={styles.resultDetail}>
                  {node.detail || `${node.group} - Level 3`}
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={theme.colors.inkSubtle} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: { zIndex: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  searchInput: { flex: 1, height: '100%', fontSize: 14, color: theme.colors.ink },
  clearBtn: { padding: 4 },
  resultsContainer: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    overflow: 'hidden',
    ...theme.shadow.lifted,
  },
  resultsHeader: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    backgroundColor: theme.colors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairlineTertiary,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairlineTertiary,
    gap: theme.spacing.xs,
  },
  resultIconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTextBox: { flex: 1 },
  resultTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.ink },
  resultDetail: { fontSize: 11, color: theme.colors.inkMuted, marginTop: 1 },
});
