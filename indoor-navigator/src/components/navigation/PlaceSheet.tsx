import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import type { FloorNode } from '../../data/old.dorm3F';
import { theme } from '../../theme';
import Icon, { type IconName } from '../common/Icon';

export type PickMode = 'origin' | 'dest';
export type Filter = 'All' | 'Rooms' | 'Facilities' | 'Circulation' | 'Checkpoints';

interface Props {
  nodes: FloorNode[];
  recents: string[];
  originId: string | null;
  destId: string | null;
  mode: PickMode;
  onMode(m: PickMode): void;
  onPick(id: string): void;
  onClearRecents(): void;
  index?: number;
  onChange?(index: number): void;
  onAnimate?(fromIndex: number, toIndex: number): void;
}

const FILTERS: Filter[] = ['All', 'Rooms', 'Facilities', 'Circulation', 'Checkpoints'];

function iconFor(n: FloorNode): IconName {
  switch (n.type) {
    case 'room': return 'bed-double';
    case 'facility': return 'sparkles';
    case 'corner': return 'map-pin';
    case 'stairs': return 'stairs';
    case 'elevator': return 'arrow-up-down';
    case 'exit': return 'door-open';
    default: return 'map-pin';
  }
}

const PlaceSheet = forwardRef<BottomSheet, Props>(function PlaceSheet(
  {
    nodes,
    recents,
    originId,
    destId,
    mode,
    onMode,
    onPick,
    onClearRecents,
    index = 0,
    onChange,
    onAnimate,
  },
  ref,
) {
  const localRef = useRef<BottomSheet>(null);
  useImperativeHandle(ref, () => localRef.current!, []);

  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const safeNodes = nodes ?? [];
  const safeRecents = recents ?? [];
  const byId = useMemo(() => new Map(safeNodes.map((n) => [n.id, n])), [safeNodes]);

  const recentNodes = safeRecents.map((id) => byId.get(id)).filter((n): n is FloorNode => !!n);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return safeNodes.filter((n) => {
      if (filter !== 'All' && n.group !== filter) return false;
      if (!query) return true;
      return (
        n.name.toLowerCase().includes(query) ||
        n.short.toLowerCase().includes(query) ||
        (n.detail ?? '').toLowerCase().includes(query)
      );
    });
  }, [nodes, q, filter]);

  const handleModeChange = (m: PickMode) => {
    onMode(m);
    localRef.current?.snapToIndex(1);
  };

  const handleSearchFocus = () => {
    localRef.current?.snapToIndex(2);
  };

  const renderItem = ({ item }: { item: FloorNode }) => {
    const isO = item.id === originId;
    const isD = item.id === destId;
    return (
      <Pressable
        style={[styles.row, (isO || isD) && styles.rowSel]}
        onPress={() => onPick(item.id)}
      >
        <Icon name={iconFor(item)} size={20} color={theme.colors.ink} />
        <View style={{ flex: 1 }}>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowDetail}>{item.detail ?? item.group}</Text>
        </View>
        {isO && <Text style={styles.tagO}>FROM</Text>}
        {isD && <Text style={styles.tagD}>TO</Text>}
        <Text style={styles.rowGo}>{mode === 'origin' ? 'Set start' : 'Set dest'}</Text>
      </Pressable>
    );
  };

  return (
    <BottomSheet
      ref={localRef}
      index={index}
      snapPoints={['22%', '52%', '88%']}
      enablePanDownToClose={false}
      onChange={onChange}
      onAnimate={onAnimate}
      containerStyle={styles.container}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={2} disappearsOnIndex={1} opacity={0.25} />
      )}
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.head}>
        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeBtn, mode === 'origin' && styles.modeOn]}
            onPress={() => handleModeChange('origin')}
          >
            <View style={styles.modeContent}>
              <Icon name="map-pin" size={14} color={mode === 'origin' ? theme.colors.canvas : theme.colors.inkSubtle} />
              <Text style={[styles.modeTxt, mode === 'origin' && styles.modeTxtOn]}>From</Text>
            </View>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, mode === 'dest' && styles.modeOn]}
            onPress={() => handleModeChange('dest')}
          >
            <View style={styles.modeContent}>
              <Icon name="target" size={14} color={mode === 'dest' ? theme.colors.canvas : theme.colors.inkSubtle} />
              <Text style={[styles.modeTxt, mode === 'dest' && styles.modeTxtOn]}>To destination</Text>
            </View>
          </Pressable>
        </View>
        <TextInput
          value={q}
          onChangeText={setQ}
          onFocus={handleSearchFocus}
          placeholder="Search rooms, laundry, study hall..."
          placeholderTextColor={theme.colors.inkSubtle}
          style={styles.search}
        />
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Pressable key={f} style={[styles.chip, filter === f && styles.chipOn]} onPress={() => setFilter(f)}>
              <Text style={[styles.chipTxt, filter === f && styles.chipTxtOn]}>{f}</Text>
            </Pressable>
          ))}
        </View>
        {recentNodes.length > 0 && (
          <View style={styles.recentRow}>
            <Text style={styles.recentTitle}>Recents · </Text>
            {recentNodes.map((n) => (
              <Pressable key={n.id} style={styles.recentPill} onPress={() => onPick(n.id)}>
                <Text style={styles.recentTxt}>{n.short}</Text>
              </Pressable>
            ))}
            <Pressable onPress={onClearRecents}>
              <Text style={styles.clearTxt}>Clear</Text>
            </Pressable>
          </View>
        )}
      </View>
      <BottomSheetFlatList
        data={list}
        keyExtractor={(item: FloorNode) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPad}
        keyboardShouldPersistTaps="handled"
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: { zIndex: 25 },
  bg: { backgroundColor: theme.colors.canvas, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
  handle: { backgroundColor: theme.colors.primary, width: 52, height: 5 },
  head: { paddingHorizontal: 16, paddingTop: 4 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.colors.surface1, alignItems: 'center', justifyContent: 'center' },
  modeContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeOn: { backgroundColor: theme.colors.ink },
  modeTxt: { fontWeight: '800', color: theme.colors.inkSubtle, fontSize: 13 },
  modeTxtOn: { color: theme.colors.canvas },
  search: { backgroundColor: theme.colors.surface1, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 14, fontSize: 15, color: theme.colors.ink },
  chips: { flexDirection: 'row', gap: 7, marginTop: 10, flexWrap: 'wrap' },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, backgroundColor: theme.colors.hairlineTertiary },
  chipOn: { backgroundColor: theme.colors.primary },
  chipTxt: { fontSize: 12.5, fontWeight: '700', color: theme.colors.ink },
  chipTxtOn: { color: theme.colors.canvas },
  recentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 6 },
  recentTitle: { fontSize: 12.5, fontWeight: '800', color: theme.colors.inkSubtle },
  recentPill: { backgroundColor: theme.colors.primarySoft, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11 },
  recentTxt: { fontWeight: '800', color: theme.colors.primaryFocus, fontSize: 12.5 },
  clearTxt: { color: theme.colors.inkSubtle, fontSize: 12.5, textDecorationLine: 'underline' },
  listPad: { paddingHorizontal: 16, paddingBottom: 30, paddingTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: theme.colors.hairline, marginBottom: 8, backgroundColor: theme.colors.canvas },
  rowSel: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
  rowName: { fontWeight: '800', color: theme.colors.ink, fontSize: 14.5 },
  rowDetail: { color: theme.colors.inkSubtle, fontSize: 12, marginTop: 1 },
  tagO: { fontSize: 10, fontWeight: '900', color: theme.colors.success, backgroundColor: theme.colors.successSoft, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  tagD: { fontSize: 10, fontWeight: '900', color: theme.colors.primaryFocus, backgroundColor: theme.colors.primarySoft, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  rowGo: { fontSize: 11.5, fontWeight: '800', color: theme.colors.inkSubtle },
});

export default PlaceSheet;
