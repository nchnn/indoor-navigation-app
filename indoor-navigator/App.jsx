import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import BackgroundGrid from './src/components/map/BackgroundGrid';

import EditableFloorPlan from './src/components/editor/EditableFloorPlan';
import EditToolbar from './src/components/editor/EditToolbar';
import RoomEditorSheet from './src/components/editor/RoomEditorSheet';
import ZoomableView from './src/components/controls/ZoomableView';
import ZoomControls from './src/components/controls/ZoomControls';
import { useViewportLock } from './src/hooks/useViewportLock';
import { theme } from './src/theme';
import {
  FLOOR_W,
  FLOOR_H,
  createEntity,
  createRoom,
  loadFloorPlan,
  resetFloorPlan,
  saveFloorPlan,
  sanitizeRooms,
  entityTitle,
  duplicateAdjacent,
} from './src/services/floorPlanStore';

export default function App() {
  const zoomableRef = useRef(null);
  // Browser page zoom off — only the in-app zoom controls scale the map.
  useViewportLock(true);
  const [zoom, setZoom] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [tool, setTool] = useState('select'); // 'select' | 'add' | 'erase'
  const [selectedId, setSelectedId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addKind, setAddKind] = useState('room');
  const saveTimer = useRef(null);
  const addKindRef = useRef('room');
  addKindRef.current = addKind;

  // Selecting a room keeps the sheet collapsed so resize handles stay
  // draggable. User taps the peek pill to expand. Rename must not collapse.
  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    if (id) setSheetOpen(false);
  }, []);

  const handleZoom = useCallback((z) => {
    setZoom((prev) => (Math.abs(prev - z) < 0.05 ? prev : z));
  }, []);

  useEffect(() => {
    let alive = true;
    loadFloorPlan().then((r) => {
      if (alive) {
        setRooms(sanitizeRooms(r));
        setLoaded(true);
      }
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setDirty(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveFloorPlan(rooms);
      setDirty(false);
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [rooms, loaded]);

  const updateRoom = useCallback((id, patch) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (patch.clearDoor) {
          const { door: _omit, clearDoor: _c, ...rest } = { ...r, ...patch };
          void _omit; void _c;
          return rest;
        }
        return { ...r, ...patch };
      }),
    );
  }, []);

  const updateDoorPosition = useCallback((id, index, position) => {
    const pos = Math.min(1, Math.max(0, position));
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id || !r.door) return r;
        if (Array.isArray(r.door)) {
          if (!r.door[index]) return r;
          const next = r.door.slice();
          next[index] = { ...next[index], position: pos };
          return { ...r, door: next };
        }
        return { ...r, door: { ...r.door, position: pos } };
      }),
    );
  }, []);

  const renameRoom = useCallback((oldId, raw) => {
    const base = String(raw ?? '').trim().toUpperCase().slice(0, 12) || oldId;
    const taken = new Set(rooms.map((r) => r.id));
    let next = base;
    let i = 2;
    while (taken.has(next) && next !== oldId) next = `${base}-${i++}`;
    setRooms((prev) => prev.map((r) => (r.id === oldId ? { ...r, id: next } : r)));
    setSelectedId((sel) => (sel === oldId ? next : sel));
  }, [rooms]);

  const deleteRoom = useCallback((id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setSelectedId((sel) => (sel === id ? null : sel));
    setSheetOpen(false);
  }, []);

  // Double-tap an edge handle duplicates the room into the adjacent cell
  // with the next M-number in that row/column's counting direction.
  // No-op when the target cell is out of bounds or already occupied.
  const duplicateRoom = useCallback((id, side) => {
    const next = duplicateAdjacent(rooms, id, side);
    if (!next) return;
    setRooms((prev) => [...prev, next]);
    setSelectedId(next.id);
    setSheetOpen(false);
  }, [rooms]);

  const addRoomAt = useCallback((x, y) => {
    setRooms((prev) => {
      const room = createRoom(prev, x, y);
      setSelectedId(room.id);
      return [...prev, room];
    });
    setSheetOpen(false);
    setTool('select');
  }, []);

  const addEntityAt = useCallback((x, y, kind) => {
    const k = kind ?? addKindRef.current;
    setRooms((prev) => {
      const entity = createEntity(prev, k, x, y);
      setSelectedId(entity.id);
      return [...prev, entity];
    });
    setSheetOpen(false);
    setTool('select');
  }, []);

  const addEntityCenter = useCallback((kind) => {
    const k = kind ?? addKindRef.current;
    setAddKind(k);
    const c = zoomableRef.current?.getViewCenter?.() ?? { x: FLOOR_W / 2, y: FLOOR_H / 2 };
    addEntityAt(c.x, c.y, k);
  }, [addEntityAt]);

  const addRoomCenter = useCallback(() => {
    const c = zoomableRef.current?.getViewCenter?.() ?? { x: FLOOR_W / 2, y: FLOOR_H / 2 };
    addRoomAt(c.x, c.y);
  }, [addRoomAt]);

  const handleReset = useCallback(async () => {
    const fresh = await resetFloorPlan();
    setRooms(sanitizeRooms(fresh));
    setSelectedId(null);
    setSheetOpen(false);
    setTool('select');
  }, []);

  const handleModeChange = useCallback((m) => {
    setMode(m);
    if (m === 'view') setTool('select');
  }, []);

  const selectedRoom = rooms.find((r) => r.id === selectedId) ?? null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.mapArea}>
          <BackgroundGrid style={StyleSheet.absoluteFill} />

          <ZoomableView
            ref={zoomableRef}
            onZoomChange={handleZoom}
            singleFingerPan={mode === 'view' || tool !== 'select'}
          >
            {loaded && (
              <EditableFloorPlan
                rooms={rooms}
                selectedId={selectedId}
                onSelect={handleSelect}
                onUpdate={updateRoom}
                onDelete={deleteRoom}
                onAddAt={(x, y) => addEntityAt(x, y)}
                onDoorPosition={updateDoorPosition}
                onDuplicate={duplicateRoom}
                editMode={mode === 'edit'}
                editTool={tool}
                zoom={zoom}
              />
            )}
          </ZoomableView>

          {/* floating map header — visual only, never intercepts gestures */}
          <View style={styles.header} pointerEvents="none">
            <View style={styles.brandDot} />
            <View>
              <Text style={styles.headerTitle}>GuideMe NEU</Text>
              <Text style={styles.headerSub}>Ground Floor · Main Building</Text>
            </View>
            <View style={styles.floorPill}>
              <Text style={styles.floorPillText}>1F</Text>
            </View>
          </View>

          <EditToolbar
            mode={mode}
            onModeChange={handleModeChange}
            tool={tool}
            onToolChange={setTool}
            onAdd={addRoomCenter}
            onAddKind={addEntityCenter}
            addKind={addKind}
            onReset={handleReset}
            dirty={dirty}
          />

          {selectedRoom && !sheetOpen && (
            <View style={styles.peekWrap} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.peekPill}
                onPress={() => setSheetOpen(true)}
                activeOpacity={0.85}
                accessibilityLabel={`Edit ${entityTitle(selectedRoom)}`}
                accessibilityRole="button"
              >
                <View style={styles.peekDot} />
                <Text style={styles.peekText} numberOfLines={1}>
                  {`${entityTitle(selectedRoom)} · ${Math.round(selectedRoom.width)}×${Math.round(selectedRoom.height)}`}
                </Text>
                <Text style={styles.peekAction}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedRoom && sheetOpen && (
            <RoomEditorSheet
              key={selectedRoom.id}
              room={selectedRoom}
              editMode={mode === 'edit'}
              onUpdate={updateRoom}
              onRename={renameRoom}
              onDelete={(id) => { setSheetOpen(false); deleteRoom(id); }}
              onClose={() => setSheetOpen(false)}
            />
          )}

          <ZoomControls zoomableRef={zoomableRef} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.gridBackground },
  mapArea: { flex: 1 },
  header: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.canvas,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    ...theme.shadow.lifted,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: theme.colors.inkSubtle,
    fontSize: 12,
    fontWeight: '600',
  },
  floorPill: {
    marginLeft: 'auto',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  floorPillText: {
    color: theme.colors.primaryFocus,
    fontSize: 13,
    fontWeight: '800',
  },
  peekWrap: {
    position: 'absolute',
    left: 16,
    right: 80,
    bottom: 24,
    alignItems: 'flex-start',
  },
  peekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.canvas,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.hairlineStrong,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: 340,
    ...theme.shadow.lifted,
  },
  peekDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  peekText: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: '800',
  },
  peekAction: {
    color: theme.colors.primaryFocus,
    fontSize: 12,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
