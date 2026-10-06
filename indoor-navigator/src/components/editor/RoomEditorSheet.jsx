import React, { useEffect, useRef, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

import BottomSheetModal from '../common/BottomSheetModal';

import { theme } from '../../theme';

import {
  MIN_SIZE,
  kindOf,
  kindLabel,
  entityTitle,
} from '../../services/floorPlanStore';


/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function TrashIcon({
  size = 16,
  color = theme.colors.error,
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M10 11v6M14 11v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}


/* -------------------------------------------------------------------------- */
/* Numeric Input                                                              */
/* -------------------------------------------------------------------------- */

function NumericInputGroup({
  label,
  value,
  min = 0,
  max,
  step = 10,
  unit = 'px',
  onChange,
}) {
  const [localVal, setLocalVal] = useState(
    String(Math.round(value ?? 0))
  );

  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setLocalVal(String(Math.round(value ?? 0)));
    }
  }, [value]);

  const commit = (raw) => {
    const str = raw !== undefined ? raw : localVal;

    const parsed = parseInt(str, 10);

    if (Number.isNaN(parsed)) {
      setLocalVal(String(Math.round(value ?? min)));
      return;
    }

    const clamped = Math.min(
      max ?? Number.POSITIVE_INFINITY,
      Math.max(min, parsed)
    );

    setLocalVal(String(clamped));

    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const adjust = (delta) => {
    const current =
      parseInt(localVal, 10) ||
      value ||
      0;

    const next = Math.min(
      max ?? Number.POSITIVE_INFINITY,
      Math.max(min, current + delta)
    );

    setLocalVal(String(next));

    onChange(next);
  };

  return (
    <View style={styles.numGroup}>
      <View style={styles.numHeader}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <Text style={styles.unitBadge}>
          {unit}
        </Text>
      </View>

      <View style={styles.numRow}>
        <TouchableOpacity
          style={styles.nudgeBtn}
          onPress={() => adjust(-step)}
          activeOpacity={0.6}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={styles.nudgeText}>
            −
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.numInput}
          value={localVal}
          onChangeText={(txt) => {
            const cleaned = txt.replace(
              /[^0-9]/g,
              ''
            );

            setLocalVal(cleaned);
          }}
          onFocus={() => {
            isFocused.current = true;
          }}
          onBlur={() => {
            isFocused.current = false;
            commit();
          }}
          onSubmitEditing={() => commit()}
          keyboardType="numeric"
          selectTextOnFocus
          placeholder="0"
          placeholderTextColor={
            theme.colors.inkTertiary
          }
        />

        <TouchableOpacity
          style={styles.nudgeBtn}
          onPress={() => adjust(step)}
          activeOpacity={0.6}
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={styles.nudgeText}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


/* -------------------------------------------------------------------------- */
/* Horizontal Option                                                          */
/* -------------------------------------------------------------------------- */

function OptionChip({
  active,
  label,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        active && styles.chipActive,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}


/*
 * Mobile-friendly horizontal selector.
 *
 * Instead of:
 *
 * [None] [Top] [Bottom]
 * [Left] [Right]
 *
 * it becomes:
 *
 * [None] [Top] [Bottom] [Left] [Right] →
 *
 * This prevents the bottom sheet from becoming too tall.
 */
function OptionScroller({
  children,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipScroll}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}


/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  children,
  last = false,
}) {
  return (
    <View
      style={[
        styles.section,
        last && styles.sectionLast,
      ]}
    >
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {children}
    </View>
  );
}


/* -------------------------------------------------------------------------- */
/* Room Editor Sheet                                                           */
/* -------------------------------------------------------------------------- */

export default function RoomEditorSheet({
  room,
  editMode = true,
  onUpdate,
  onRename,
  onDelete,
  onClose,
}) {
  const [labelInput, setLabelInput] = useState(
    room?.label ?? room?.id ?? ''
  );

  useEffect(() => {
    setLabelInput(room?.label ?? room?.id ?? '');
  }, [room?.id, room?.label]);

  if (!room) {
    return null;
  }

  const kind = kindOf(room);

  const kindName = kindLabel(kind);

  const doorList = room.door == null
    ? []
    : Array.isArray(room.door)
      ? room.door
      : [room.door];

  const MAX_DOORS = 6;

  const area = (
    (room.width * room.height) /
    10000
  ).toFixed(2);

  const subtitle =
    `${Math.round(room.width)} × ` +
    `${Math.round(room.height)} px · ` +
    `${area} m²`;

  const commitLabel = () => {
    // Names are optional — blank is allowed and shows an empty label.
    // The internal id stays unique so selection keeps working.
    const trimmed = labelInput.trim().toUpperCase().slice(0, 12);
    const current = room.label ?? room.id;

    if (trimmed !== current) {
      onUpdate?.(
        room.id,
        { label: trimmed }
      );
      setLabelInput(trimmed);
    } else {
      setLabelInput(current);
    }
  };


  /* ---------------------------------------------------------------------- */
  /* Doors (multiple per room)                                                */
  /* ---------------------------------------------------------------------- */

  const writeDoors = (next) => {
    if (next.length === 0) {
      const {
        door: _omit,
        ...rest
      } = room;

      void _omit;

      onUpdate?.(
        room.id,
        {
          ...rest,
          door: undefined,
          clearDoor: true,
        }
      );

      return;
    }

    onUpdate?.(
      room.id,
      {
        door: next.length === 1 && !Array.isArray(room.door)
          ? next[0]
          : next,
      }
    );
  };

  const updateDoorAt = (index, patch) => {
    const next = doorList.map((d, i) =>
      i === index ? { ...d, ...patch } : d
    );

    writeDoors(next);
  };

  const removeDoorAt = (index) => {
    writeDoors(doorList.filter((_, i) => i !== index));
  };

  const addDoor = () => {
    if (doorList.length >= MAX_DOORS) return;

    const walls = ['bottom', 'top', 'left', 'right'];
    const counts = walls.map((w) =>
      doorList.filter((d) => (d.wall ?? 'bottom') === w).length
    );

    let wall = walls[0];
    let min = counts[0];

    walls.forEach((w, i) => {
      if (counts[i] < min) {
        min = counts[i];
        wall = w;
      }
    });

    writeDoors([
      ...doorList,
      {
        wall,
        type: 'single',
        swing: 'in',
        hinge: wall === 'left' || wall === 'right' ? 'top' : 'left',
        position: 0.5,
      },
    ]);
  };


  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <BottomSheetModal
      visible={Boolean(room)}
      onClose={onClose}
      title={entityTitle(room)}
      subtitle={subtitle}
    >

      {/* ------------------------------------------------------------------ */}
      {/* Label                                                               */}
      {/* ------------------------------------------------------------------ */}

      <Section title={`${kindName} Label`}>
        <TextInput
          value={labelInput}
          onChangeText={setLabelInput}
          onSubmitEditing={commitLabel}
          onBlur={commitLabel}
          style={styles.textInput}
          maxLength={12}
          autoCapitalize="characters"
          placeholder={
            kind === 'cr'
              ? 'e.g. CR1'
              : kind === 'stair'
              ? 'e.g. ST1'
              : 'e.g. M110'
          }
          placeholderTextColor={
            theme.colors.inkTertiary
          }
        />
      </Section>


      {/* ------------------------------------------------------------------ */}
      {/* Position                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Section title="Position">
        <View style={styles.grid2}>
          <NumericInputGroup
            label="X Position"
            value={room.x}
            min={0}
            step={20}
            unit="px"
            onChange={(val) =>
              onUpdate?.(
                room.id,
                { x: val }
              )
            }
          />

          <NumericInputGroup
            label="Y Position"
            value={room.y}
            min={0}
            step={20}
            unit="px"
            onChange={(val) =>
              onUpdate?.(
                room.id,
                { y: val }
              )
            }
          />
        </View>
      </Section>


      {/* ------------------------------------------------------------------ */}
      {/* Dimensions                                                          */}
      {/* ------------------------------------------------------------------ */}

      <Section title="Dimensions">
        <View style={styles.grid2}>
          <NumericInputGroup
            label="Width"
            value={room.width}
            min={MIN_SIZE}
            step={10}
            unit="px"
            onChange={(val) =>
              onUpdate?.(
                room.id,
                { width: val }
              )
            }
          />

          <NumericInputGroup
            label="Height"
            value={room.height}
            min={MIN_SIZE}
            step={10}
            unit="px"
            onChange={(val) =>
              onUpdate?.(
                room.id,
                { height: val }
              )
            }
          />
        </View>
      </Section>


      {/* ================================================================== */}
      {/* ROOM                                                                */}
      {/* ================================================================== */}

      {kind === 'room' && (
        <>
          <Section
            title={
              doorList.length
                ? `Doors (${doorList.length})`
                : 'Doors'
            }
          >

            {doorList.map((door, doorIndex) => (
              <View
                key={doorIndex}
                style={styles.doorSubOptions}
              >

                <View style={styles.doorHeaderRow}>
                  <Text style={styles.subLabel}>
                    {
                      `Door ${doorIndex + 1} · ` +
                      `${(door.wall ?? 'bottom').toUpperCase()}`
                    }
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      removeDoorAt(doorIndex)
                    }
                    activeOpacity={0.7}
                    accessibilityLabel={`Remove door ${doorIndex + 1}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.removeText}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={styles.subLabel}>
                    Wall
                  </Text>

                  <OptionScroller>
                    {['top', 'bottom', 'left', 'right'].map((w) => (
                      <OptionChip
                        key={w}
                        active={(door.wall ?? 'bottom') === w}
                        label={w[0].toUpperCase() + w.slice(1)}
                        onPress={() =>
                          updateDoorAt(doorIndex, {
                            wall: w,
                            hinge:
                              w === 'left' || w === 'right'
                                ? 'top'
                                : 'left',
                          })
                        }
                      />
                    ))}
                  </OptionScroller>
                </View>

                <View>
  <Text style={styles.subLabel}>
    Door Type
  </Text>

  <OptionScroller>
    {/* Single */}
    <OptionChip
      active={
        (door.type ?? 'single') === 'single'
      }
      label="Single"
      onPress={() =>
        updateDoorAt(doorIndex, {
          type: 'single',
        })
      }
    />

    {/* Double */}
    <OptionChip
      active={
        door.type === 'double'
      }
      label="Double"
      onPress={() =>
        updateDoorAt(doorIndex, {
          type: 'double',
        })
      }
    />

    {/* Double Corner */}
    <OptionChip
      active={
        door.type === 'double-corner'
      }
      label="Double Corner"
      onPress={() =>
        updateDoorAt(doorIndex, {
          type: 'double-corner',
        })
      }
    />
  </OptionScroller>
</View>


                {(door.type ?? 'single') !== 'double-corner' && (
                <View>
                  <Text style={styles.subLabel}>
                    Position along wall
                  </Text>

                  <OptionScroller>

                    <OptionChip
                      active={
                        (door.position ?? 0.5) < 0.34
                      }
                      label="Start"
                      onPress={() =>
                        updateDoorAt(doorIndex, {
                          position: 0,
                        })
                      }
                    />

                    <OptionChip
                      active={
                        (door.position ?? 0.5) >= 0.34 &&
                        (door.position ?? 0.5) <= 0.66
                      }
                      label="Center"
                      onPress={() =>
                        updateDoorAt(doorIndex, {
                          position: 0.5,
                        })
                      }
                    />

                    <OptionChip
                      active={
                        (door.position ?? 0.5) > 0.66
                      }
                      label="End"
                      onPress={() =>
                        updateDoorAt(doorIndex, {
                          position: 1,
                        })
                      }
                    />

                  </OptionScroller>

                  <NumericInputGroup
                    label="Position"
                    value={Math.round((door.position ?? 0.5) * 100)}
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                    onChange={(val) =>
                      updateDoorAt(doorIndex, {
                        position: Math.min(1, Math.max(0, val / 100)),
                      })
                    }
                  />
                </View>
                )}

                <View>
                  <Text style={styles.subLabel}>
                    Swing
                  </Text>

                  <OptionScroller>

                    <OptionChip
                      active={
                        door.swing !==
                        'out'
                      }
                      label="Inward"
                      onPress={() =>
                        updateDoorAt(doorIndex, {
                          swing: 'in',
                        })
                      }
                    />

                    <OptionChip
                      active={
                        door.swing ===
                        'out'
                      }
                      label="Outward"
                      onPress={() =>
                        updateDoorAt(doorIndex, {
                          swing: 'out',
                        })
                      }
                    />

                  </OptionScroller>
                </View>

                <View>
                  <Text style={styles.subLabel}>
                    Hinge
                  </Text>

                  <OptionScroller>

                    {(door.wall === 'left' || door.wall === 'right' ? [
                      { label: 'Top', value: 'top' },
                      { label: 'Bottom', value: 'bottom' },
                    ] : [
                      { label: 'Left', value: 'left' },
                      { label: 'Right', value: 'right' },
                    ]).map((h) => (
                      <OptionChip
                        key={h.value}
                        active={(
                          door.hinge ??
                          (
                            door.wall === 'left' || door.wall === 'right'
                              ? 'top'
                              : 'left'
                          )
                        ) === h.value}
                        label={h.label}
                        onPress={() =>
                          updateDoorAt(doorIndex, {
                            hinge: h.value,
                          })
                        }
                      />
                    ))}

                  </OptionScroller>
                </View>

              </View>
            ))}

            {doorList.length < MAX_DOORS && (
              <TouchableOpacity
                onPress={addDoor}
                style={styles.addBtn}
                activeOpacity={0.7}
                accessibilityLabel="Add door"
                accessibilityRole="button"
              >
                <Text style={styles.addText}>
                  {doorList.length ? '+ Add another door' : '+ Add door'}
                </Text>
              </TouchableOpacity>
            )}

          </Section>
        </>
      )}


      {/* ================================================================== */}
      {/* CR                                                                  */}
      {/* ================================================================== */}

      {kind === 'cr' && (
        <>
          <Section title="CR Type">

            <OptionScroller>

              <OptionChip
                active={
                  (room.crType ?? 'male') ===
                  'male'
                }
                label="Male"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { crType: 'male' }
                  )
                }
              />

              <OptionChip
                active={
                  (room.crType ?? 'male') ===
                  'female'
                }
                label="Female"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { crType: 'female' }
                  )
                }
              />

              <OptionChip
                active={
                  (room.crType ?? 'male') ===
                  'split'
                }
                label="Split M/F"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { crType: 'split' }
                  )
                }
              />

            </OptionScroller>

          </Section>


          <Section title="Door Position">

            <OptionScroller>

              <OptionChip
                active={
                  (room.doorPosition ??
                    'bottomLeft') ===
                  'topLeft'
                }
                label="Top Left"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    {
                      doorPosition:
                        'topLeft',
                    }
                  )
                }
              />

              <OptionChip
                active={
                  (room.doorPosition ??
                    'bottomLeft') ===
                  'topRight'
                }
                label="Top Right"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    {
                      doorPosition:
                        'topRight',
                    }
                  )
                }
              />

              <OptionChip
                active={
                  (room.doorPosition ??
                    'bottomLeft') ===
                  'bottomLeft'
                }
                label="Bottom Left"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    {
                      doorPosition:
                        'bottomLeft',
                    }
                  )
                }
              />

              <OptionChip
                active={
                  (room.doorPosition ??
                    'bottomLeft') ===
                  'bottomRight'
                }
                label="Bottom Right"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    {
                      doorPosition:
                        'bottomRight',
                    }
                  )
                }
              />

            </OptionScroller>

          </Section>
        </>
      )}


      {/* ================================================================== */}
      {/* STAIR                                                               */}
      {/* ================================================================== */}

      {kind === 'stair' && (
        <>
          <Section title="Facing">

            <OptionScroller>

              <OptionChip
                active={
                  (room.facing ?? 'right') ===
                  'right'
                }
                label="Right"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { facing: 'right' }
                  )
                }
              />

              <OptionChip
                active={
                  (room.facing ?? 'right') ===
                  'left'
                }
                label="Left"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { facing: 'left' }
                  )
                }
              />

              <OptionChip
                active={
                  (room.facing ?? 'right') ===
                  'up'
                }
                label="Up"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { facing: 'up' }
                  )
                }
              />

              <OptionChip
                active={
                  (room.facing ?? 'right') ===
                  'down'
                }
                label="Down"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { facing: 'down' }
                  )
                }
              />

            </OptionScroller>

          </Section>


          <Section title="Up Side">

            <OptionScroller>

              <OptionChip
                active={
                  (room.upSide ?? 'left') ===
                  'left'
                }
                label="Left"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { upSide: 'left' }
                  )
                }
              />

              <OptionChip
                active={
                  (room.upSide ?? 'left') ===
                  'right'
                }
                label="Right"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    { upSide: 'right' }
                  )
                }
              />

            </OptionScroller>

          </Section>


          <Section title="Level">

            <OptionScroller>

              <OptionChip
                active={!room.hasBelow}
                label="Ground"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    {
                      hasBelow: false,
                    }
                  )
                }
              />

              <OptionChip
                active={Boolean(
                  room.hasBelow
                )}
                label="Has Below"
                onPress={() =>
                  onUpdate?.(
                    room.id,
                    {
                      hasBelow: true,
                    }
                  )
                }
              />

            </OptionScroller>

          </Section>
        </>
      )}


      {/* ------------------------------------------------------------------ */}
      {/* DELETE                                                              */}
      {/* ------------------------------------------------------------------ */}

      <TouchableOpacity
        onPress={() =>
          onDelete?.(room.id)
        }
        style={styles.deleteBtn}
        activeOpacity={0.75}
        accessibilityLabel={
          `Delete ${kindName}`
        }
        accessibilityRole="button"
      >
        <TrashIcon />

        <Text style={styles.deleteText}>
          Delete {kindName}
        </Text>
      </TouchableOpacity>

    </BottomSheetModal>
  );
}


/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({

  /* ---------------------------------------------------------------------- */
  /* Sections                                                               */
  /* ---------------------------------------------------------------------- */

  section: {
    gap: 8,
    marginBottom: 18,
  },

  sectionLast: {
    marginBottom: 0,
  },

  sectionTitle: {
    color: theme.colors.inkMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  subLabel: {
    color: theme.colors.inkSubtle,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 5,
  },


  /* ---------------------------------------------------------------------- */
  /* Label                                                                  */
  /* ---------------------------------------------------------------------- */

  textInput: {
    minHeight: 44,

    borderWidth: 1,
    borderColor:
      theme.colors.hairlineStrong,

    borderRadius:
      theme.radius.md,

    paddingHorizontal: 12,

    fontSize: 14,
    color: theme.colors.ink,
    fontWeight: '800',

    backgroundColor:
      theme.colors.surface1,
  },


  /* ---------------------------------------------------------------------- */
  /* Position / Dimensions                                                  */
  /* ---------------------------------------------------------------------- */

  grid2: {
    flexDirection: 'row',
    gap: 8,
  },

  numGroup: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  numHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fieldLabel: {
    color: theme.colors.inkSubtle,
    fontSize: 10,
    fontWeight: '800',
  },

  unitBadge: {
    color: theme.colors.inkTertiary,
    fontSize: 9,
    fontWeight: '700',
  },

  numRow: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 42,

    borderWidth: 1,
    borderColor:
      theme.colors.hairlineStrong,

    borderRadius:
      theme.radius.md,

    backgroundColor:
      theme.colors.surface1,

    overflow: 'hidden',
  },

  numInput: {
    flex: 1,

    minWidth: 0,

    fontSize: 13,
    fontWeight: '800',

    color: theme.colors.ink,

    textAlign: 'center',

    paddingHorizontal: 2,
  },

  nudgeBtn: {
    width: 34,
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      theme.colors.surface2,
  },

  nudgeText: {
    color: theme.colors.inkMuted,
    fontSize: 16,
    fontWeight: '900',
  },


  /* ---------------------------------------------------------------------- */
  /* Horizontal Chips                                                       */
  /* ---------------------------------------------------------------------- */

  chipScroll: {
    flexDirection: 'row',
    gap: 6,

    paddingRight: 10,
  },

  chip: {
    minHeight: 36,

    paddingHorizontal: 13,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius:
      theme.radius.pill,

    backgroundColor:
      theme.colors.surface1,

    borderWidth: 1,
    borderColor:
      theme.colors.hairlineTertiary,
  },

  chipActive: {
    backgroundColor:
      theme.colors.primarySoft,

    borderColor:
      theme.colors.primaryFocus,
  },

  chipText: {
    color: theme.colors.inkMuted,

    fontSize: 11,
    fontWeight: '800',
  },

  chipTextActive: {
    color:
      theme.colors.primaryFocus,
  },


  /* ---------------------------------------------------------------------- */
  /* Door Options                                                           */
  /* ---------------------------------------------------------------------- */

  doorSubOptions: {
    marginTop: 8,

    gap: 12,

    padding: 10,

    backgroundColor:
      theme.colors.surface1,

    borderRadius:
      theme.radius.md,

    borderWidth: 1,

    borderColor:
      theme.colors.hairlineTertiary,
  },

  doorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  removeText: {
    color: theme.colors.error,
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  addBtn: {
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius:
      theme.radius.md,

    borderWidth: 1,
    borderStyle: 'dashed',

    borderColor:
      theme.colors.primaryFocus,

    backgroundColor:
      theme.colors.primarySoft,

    marginTop: 8,
  },

  addText: {
    color:
      theme.colors.primaryFocus,

    fontSize: 12,

    fontWeight: '900',
  },


  /* ---------------------------------------------------------------------- */
  /* Delete                                                                  */
  /* ---------------------------------------------------------------------- */

  deleteBtn: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    backgroundColor:
      theme.colors.primarySoft,

    borderWidth: 1,

    borderColor:
      theme.colors.error,

    borderRadius:
      theme.radius.md,

    paddingVertical: 10,

  },

  deleteText: {
    color: theme.colors.error,

    fontSize: 12,

    fontWeight: '900',
  },
});