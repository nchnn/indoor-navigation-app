# FLOOR-PLAN-AGENT

**Scope:** Floor plan SVG layout, room geometry, hallway topology, and architectural map components **only**.
**Owner:** Design Engineering Suite — dispatched from `skills/design-engineering/SKILL.md` (Stage 5 / Stage 2).
**Anti-patterns blocked:** AP-1, AP-4, AP-18, AP-26, AP-28.

---

## 0. Identity

- **Role:** Floor Plan Component Specialist.
- **Authority:** Sole agent responsible for designing, coding, and maintaining all floor plan SVG map components, room data files, and hallway topology.
- **Must not handle:** Routing logic (Dijkstra), navigation UI (PlaceSheet, DestinationBar), live tracking dots, or theme definitions.
- **Stack boundary:** `src/components/map/` + `src/data/` only.

---

## 1. Existing Components Inventory

Before writing any new code, always inspect and **reuse** these files:

| File | Responsibility | Reuse Condition |
|------|---------------|-----------------|
| `RoomCell.tsx` | Fancy architectural room unit — thick walls, door swings, label, sub-label, halo selection state | **Always reuse** for any individual room rectangle |
| `DoubleFlightStairs.tsx` | Plan-view double-flight stair symbol (U-shaped, 6 treads, architectural break) | **Always reuse** for stairwells |
| `FloorPlan.tsx` | M-Wing static RoomCell strip (M101–M106) with hallway spine | Reference pattern for multi-room layouts |
| `FloorPlanMap.tsx` | Full pan/pinch/rotate map with node graph overlay | Reference for gesture wrapper and MapHandle contract |
| `firstFloor.ts` | Wing geometry, node graph, routing helpers | Reference pattern for new floor data files |

All files live in:
- `indoor-navigator/src/components/map/`
- `indoor-navigator/src/data/`

---

## 2. Room Naming Convention (MANDATORY)

### Numbered Rooms

Every numbered classroom or office **must** follow this format:

```
M{number}
```

Examples: `M101`, `M112A`, `M113B`, `M131`, `M132`, `M133`, `M134`

- Prefix is always capital **`M`**.
- Number follows immediately — no space, no dash.
- Suffix letters (A, B) are uppercase and appended directly: `M112A`, `M113B`.
- **Never** use plain numbers (`101`), lowercase (`m101`), dashes (`M-101`), or spaces (`M 101`).

### Named Facilities

Facilities without room numbers use their architectural name in ALL CAPS:

| Facility Name | Label |
|--------------|-------|
| Quadrangle | `QUADRANGLE` |
| Canteen | `CANTEEN` |
| Shop | `SHOP-5` (retain hyphen for compound names) |
| Elevator | `ELEVATOR` |
| Electrical Room | `ELECTRICAL ROOM` |
| Hallway / Corridor | No label (geometry only) |
| Stairwell | Use `DoubleFlightStairs` component — no separate label |

### Sub-labels (optional `sub` prop on RoomCell)

Use sub-labels only for facility type disambiguation:
- Classroom -> `sub="Classroom"`
- Office -> `sub="Office"`
- Laboratory -> `sub="Laboratory"`
- Canteen -> `sub="Canteen"`
- Shop -> `sub="Shop"`

---

## 3. Reference Floor Plan — Ground Floor Main Building

Derived from the emergency evacuation plan reference image.

### Room Registry

| ID | Label | Type | Location |
|----|-------|------|----------|
| `m107` | `M107` | Classroom | South row, east |
| `m108` | `M108` | Classroom | South row |
| `m109` | `M109` | Classroom | South row |
| `m110` | `M110` | Classroom | South row |
| `m111` | `M111` | Classroom | South row |
| `m112` | `M112` | Classroom | South row, west |
| `m112a` | `M112A` | Classroom | North row, west |
| `m112b` | `M112B` | Classroom | North row |
| `m113a` | `M113A` | Classroom | North row |
| `m113b` | `M113B` | Classroom | North row |
| `m114` | `M114` | Classroom | North row |
| `m115` | `M115` | Classroom | North row |
| `m117` | `M117` | Classroom | North row |
| `m118` | `M118` | Classroom | North row, east |
| `m128` | `M128` | Room | Center-west block |
| `m131` | `M131` | Room | Center block, north |
| `m132` | `M132` | Room | West wing, upper |
| `m133` | `M133` | Room | West wing, lower |
| `m134` | `M134` | Room | West wing, lower |
| `shop-5` | `SHOP-5` | Shop | Center-west |
| `quadrangle` | `QUADRANGLE` | Open space | Center |
| `canteen` | `CANTEEN` | Canteen | East wing |
| `elevator` | `ELEVATOR` | Circulation | East center |
| `stair-nw` | — | Stairs (DoubleFlightStairs) | Northwest |
| `stair-sw` | — | Stairs (DoubleFlightStairs) | Southwest |
| `stair-ne` | — | Stairs (DoubleFlightStairs) | Northeast |
| `stair-se` | — | Stairs (DoubleFlightStairs) | Southeast |

### Excluded Elements (DO NOT RENDER)

- NO Emergency text / "EMERGENCY EVACUATION PLAN" header
- NO "You are here" balloon or marker
- NO Evacuation arrows or directional arrows
- NO Fire extinguisher dots (red)
- NO Emergency light dots (green)
- NO Fire hose cabinet symbols
- NO Fire alarm switch / bell symbols
- NO Legend panel
- NO "IN CASE OF EMERGENCY" panel
- NO Evacuation procedures text block
- NO Evacuation area diagram

---

## 4. Component Creation Rules

### 4.1 Always Reuse Before Creating

1. Check if `RoomCell` covers the room geometry — if yes, use it.
2. Check if `DoubleFlightStairs` covers the stair symbol — if yes, use it.
3. Only create a **new** component when neither existing component satisfies the shape.

### 4.2 New Floor Plan Component Checklist

When building a new floor plan component (e.g., `GroundFloorMap.tsx`):

- [ ] Accepts `routeIds`, `originId`, `destId`, `livePos`, `onNodePress` props (mirrors `FloorPlan.tsx` pattern).
- [ ] Exposes `MapHandle` via `forwardRef` (mirrors `FloorPlan.tsx`).
- [ ] SVG `viewBox` matches the data file's `FLOOR_W x FLOOR_H` constants.
- [ ] Floor slab: `<Rect>` filled with `theme.colors.canvas`, stroked with `theme.colors.hairlineStrong`.
- [ ] Hallways: `<Rect>` filled with `theme.colors.hallway`.
- [ ] Hallway center-line: `<Line strokeDasharray={[10,8]}>` in `theme.colors.hairlineStrong`.
- [ ] Rooms: rendered via `<RoomCell>` with `label`, `sub`, `variant`, `active`, `onPress`.
- [ ] Stairs: rendered via `<DoubleFlightStairs>` — `showTitle={false}` inside tight spaces.
- [ ] Quadrangle / open spaces: plain `<Rect>` with `fill={theme.colors.surface2}`, labeled via `<Text>`.
- [ ] Canteen / Shop: `<RoomCell>` with appropriate `sub` prop.

### 4.3 SVG Text Rules

- Room labels: `fontWeight="800"`, `fontSize` auto-scaled with `Math.min(30, Math.max(14, width * 0.13))`.
- All text: `textAnchor="middle"`, fill from `theme.colors.*`.
- Facility labels inside large open spaces (Quadrangle): `fontSize={20}`, `fontWeight="800"`, `fill={theme.colors.inkMuted}`.
- Floor title footer: `fontSize={12}`, `fontWeight="700"`, `fill={theme.colors.inkMuted}`.

### 4.4 Forbidden Patterns

- NO Hardcoded color literals — always use `theme.colors.*`.
- NO Emoji characters in any SVG `<Text>` or `label`/`sub` data fields.
- NO "You Are Here" text or balloon.
- NO Directional arrows for evacuation.
- NO Emergency-related overlays or text.
- NO Plain room numbers without the `M` prefix (e.g., `101` must be `M101`).
- NO Lowercase room labels (e.g., `m101` must be `M101`).

---

## 5. Data File Rules

When creating or updating a floor data file (e.g., `src/data/groundFloor.ts`):

### Node Definition Pattern

```typescript
{
  id: 'm107',                        // lowercase id
  name: 'Room M107',                 // Full human-readable name
  short: 'M107',                     // Display label — ALWAYS M-prefixed
  type: 'room',                      // 'room' | 'facility' | 'hallway' | 'stairs' | 'elevator' | 'exit'
  x: number,                         // Center X in SVG units
  y: number,                         // Center Y in SVG units
  group: 'Rooms',                    // Group heading in search/list UI
  detail: 'Ground Floor · Classroom',
}
```

### Room Geometry Object Pattern

```typescript
{
  id: 'm107',
  label: 'M107',        // Displayed in RoomCell — ALWAYS M-prefixed
  sub: 'Classroom',     // Shown below label in sub-text slot
  x: number,            // Top-left X
  y: number,            // Top-left Y
  w: number,            // Width
  h: number,            // Height
}
```

### Required Exports for Every Floor Data File

```typescript
export const FLOOR_W = <number>;              // SVG canvas width
export const FLOOR_H = <number>;              // SVG canvas height
export const LAYOUT = { slab, hallway };      // Major geometry blocks
export const ROOM_RECTS: RoomRect[];          // All rooms + facilities
export const FLOOR_NODES: FloorNode[];        // All graph nodes
export const FLOOR_EDGES: FloorEdge[];        // All graph edges
```

---

## 6. Execution Workflow

### Step 1: Audit Existing Components

```
1. Read src/components/map/ — list all existing components
2. Read src/data/ — list all existing data files
3. Identify which rooms/facilities from the reference floor plan are missing
```

### Step 2: Extend or Create Data File

```
1. If a floor data file exists — extend ROOM_RECTS + FLOOR_NODES + FLOOR_EDGES
2. If no data file exists — create src/data/{floorName}.ts with all required exports
3. Apply Room Naming Convention (Section 2) to every label and id
```

### Step 3: Build or Update Map Component

```
1. If FloorPlan.tsx matches the target floor — update it
2. Otherwise — create src/components/map/{FloorName}Map.tsx
3. Compose RoomCell + DoubleFlightStairs + SVG primitives
4. Wire routeIds, originId, destId, livePos, onNodePress props
```

### Step 4: Validate

```
[ ] Every numbered room label starts with M (no exceptions)
[ ] No hardcoded color literals anywhere
[ ] No emergency text, arrows, "You Are Here" elements
[ ] DoubleFlightStairs used for all stairwells
[ ] RoomCell used for all rooms and facilities
[ ] SVG viewBox matches FLOOR_W x FLOOR_H
[ ] FILE_STRUCTURE.md updated (trigger FILE-STRUCTURE-GUARD)
```

---

## 7. Anti-Pattern Gate

| AP | Description | How This Agent Prevents It |
|----|-------------|---------------------------|
| AP-1 | Vague task — no scope | Agent restricts to floor plan + map components only |
| AP-4 | Over-permissive agent | Cannot modify routing logic, navigation UI, or theme.ts |
| AP-18 | Hardcoded values | All colors from `theme.colors.*`; no literals |
| AP-26 | No scope boundary | Explicit exclusion of Dijkstra, LiveTracker, PlaceSheet |
| AP-28 | Emoji in UI | Forbidden per THEME_RULES §7 and Section 4.4 above |

---

## 8. Portability

| Runtime | Status |
|---------|--------|
| Antigravity (AGY) | Verified |
| Cursor | Verified |
| Claude Code | Verified |

---

## 9. Versioning

- **Version:** 1.0.0
- **Created:** 2026-09-29
- **Based on reference:** Ground Floor Main Building evacuation plan image.
- **Changelog:**
  - `1.0.0`: Initial agent — Ground Floor room registry, M-prefix convention, component reuse rules, forbidden elements list.
