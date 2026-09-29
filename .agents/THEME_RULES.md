# Theme & Color Management Rules

Enforce project color palette and styling consistency at all times.

---

## 1. Single Source of Truth

- All colors must come from `indoor-navigator/src/theme.ts` (`theme.colors.*`).
- **Zero hardcoded color literals** in components (`App.tsx`, `src/components/*`). No raw `#fff`, `#FF5C8A`, `rgba(...)`, or any other literal color strings inside JSX or `StyleSheet.create`.
- If a missing color or semantic variant is required, add it to `src/theme.ts` first, then reference it in UI.

---

## 2. Palette & Semantic Roles

### Canvas & Surface Ladder

The white canvas is the anchor surface. Each step adds a faint cool-gray tint to convey depth — **never use shadows to replace the surface ladder, and never skip levels**.

| Token | Value | Role / Usage |
|---|---|---|
| `canvas` | `#FFFFFF` | Root screen / page background — pure white |
| `surface1` | `#F7F8FA` | Cards, panels, bottom sheets — 1-step lift from canvas |
| `surface2` | `#F0F1F5` | Featured/hovered cards, active panels — 2-step lift |
| `surface3` | `#E8E9EF` | Sub-nav, dropdowns, inline tag backgrounds — 3-step |
| `surface4` | `#DEDFE6` | Deepest lifted surface, pressed tile states — 4-step |

### Hairline Borders

Borders carry visual hierarchy in place of drop-shadows — same philosophy as Linear.

| Token | Value | Role / Usage |
|---|---|---|
| `hairline` | `#E5E7EB` | Standard 1px borders on cards and list dividers |
| `hairlineStrong` | `#D1D3DC` | Focused input outlines, active card borders |
| `hairlineTertiary` | `#EDEEF1` | Nested-surface / secondary divider borders |

### Ink (Text) Hierarchy

Anchored in near-black with a faint indigo tint — resonates with the pink accent family.

| Token | Value | Role / Usage |
|---|---|---|
| `ink` | `#1A1A2E` | Headlines, primary labels, active icons |
| `inkMuted` | `#4A4A5A` | Secondary text, route instructions, distances |
| `inkSubtle` | `#8A8A9A` | Tertiary text, deselected tabs, footer links |
| `inkTertiary` | `#ADADBD` | Disabled states, footnotes, ghost placeholders |

### Pink — The Single Chromatic Accent

Used **scarcely**: brand mark, primary CTA, active route line, focus ring, link emphasis.  
Do **not** use pink as a section background, card fill, or decorative gradient.

| Token | Value | Role / Usage |
|---|---|---|
| `primary` | `#FF5C8A` | Primary CTA, active route path, brand mark, focus ring |
| `primaryHover` | `#FF7DA3` | Hover state — lighter (+15 L), same hue |
| `primaryFocus` | `#F04878` | Pressed / focus-ring deep state — darker (−8 L) |
| `primarySoft` | `#FFE3EC` | Accent tint surface — facility badge bg, recents pill bg |
| `primaryGlow` | `rgba(255,92,138,0.18)` | Halo behind active floorplan route paths |

### Semantic

| Token | Value | Role / Usage |
|---|---|---|
| `success` | `#22C55E` | Origin marker, departure tag, success indicator |
| `successSoft` | `#E8F9EF` | Success surface tint for badge backgrounds |
| `error` | `#DC2626` | Error / alert state |
| `overlay` | `rgba(0,0,0,0.40)` | Modal / bottom-sheet scrim |

### Floorplan Map Surfaces

| Token | Value | Role / Usage |
|---|---|---|
| `hallway` | `#F7F8FA` | Corridor / hallway fill (= surface1) |
| `roomFill` | `#FFFFFF` | Room fill — pure white (canvas level) |
| `roomBorder` | `#E3E4E8` | Room boundary wall stroke (≈ hairline) |

### Legacy Aliases *(kept for backward-compat — prefer tokens above)*

| Legacy Token | Maps to | Value |
|---|---|---|
| `white` | `canvas` | `#FFFFFF` |
| `grayBg` | `surface1` | `#F7F8FA` |
| `grayBorder` | `hairline` | `#E5E7EB` |
| `grayChip` | `hairlineTertiary` | `#EDEEF1` |
| `muted` | `inkSubtle` | `#8A8A9A` |
| `pink` | `primary` | `#FF5C8A` |
| `pinkDark` | `primaryFocus` | `#F04878` |
| `pinkSoft` | `primarySoft` | `#FFE3EC` |
| `pinkGlow` | `primaryGlow` | `rgba(255,92,138,0.18)` |
| `activeTint` | — | `#FFF0F5` |

---

## 3. Shading & Tonal Philosophy

This palette is built around **three primaries**: white, light gray, and pink.

### White (Canvas)
- `#FFFFFF` is the true anchor — the deepest surface, used as the page/screen root.
- Lifted surfaces step away from white using cool-gray tints (not warm beige or yellow).
- Each surface step shifts hue toward a slightly desaturated blue-gray (HSL ~230°, low saturation, high lightness).

### Light Gray (Surface Ladder)
- The four-step ladder: `#F7F8FA → #F0F1F5 → #E8E9EF → #DEDFE6`.
- Tonal rule: each step drops ~4–7 lightness points and adds a faint blue-gray desaturation (+2–4 saturation, hue anchored near 230°).
- Hairline borders follow the same cool-gray hue family and sit between adjacent surface steps in lightness.
- **Never use warm grays** (no yellow/beige tint) — the light-gray family must be perceptibly cool.

### Pink (Chromatic Accent)
- The **only saturated color** in the system. Treat it as scarce.
- Base `#FF5C8A` — hue ~343°, saturation ~100%, lightness ~67%.
- **Hover** (`#FF7DA3`) shifts +15 lightness — the pink gets lighter/softer.
- **Focus/Pressed** (`#F04878`) shifts −8 lightness — the pink gets deeper/more assertive.
- **Soft** (`#FFE3EC`) is a low-saturation tint (~95% lightness) for badge/pill backgrounds — not a true surface color.
- **Glow** is a 18% alpha overlay for SVG route halos only.

---

## 4. Component Styling Rules

### Text Contrast
- Primary labels and card headers: always `theme.colors.ink`.
- Secondary / metadata text: always `theme.colors.inkMuted`.
- Tertiary text (footer, deselected tabs): always `theme.colors.inkSubtle`.
- Disabled / ghost text: always `theme.colors.inkTertiary`.
- Active step / kicker text: always `theme.colors.primaryFocus` (deep pink).
- Text on `primary` or `ink`-fill buttons: always `theme.colors.canvas` (white).

### Borders & Dividers
- All standard cards, floating action buttons, and list rows: `borderColor: theme.colors.hairline`.
- Selected / active cards must switch border to `theme.colors.primary`.
- Focused inputs use a 2px `theme.colors.primaryFocus` outline at 50% opacity.

### Elevation & Shadows
- Depth is carried by the **surface ladder + hairline borders first**.
- Cards and floating overlays use `theme.shadow.card` (pink-tinted, subtle).
- Non-accent elevated surfaces (sub-nav, modals) use `theme.shadow.lifted` (ink-tinted, very subtle).
- **Never** apply both a shadow and a surface-lift to the same element — pick one.

### Map Elements (SVG)
- All `fill` and `stroke` attributes on Svg paths, rects, circles, and polylines must bind to `theme.colors.*`.
- Active route: `fill={theme.colors.primary}`, glow halo: `fill={theme.colors.primaryGlow}`.
- Inactive checkpoints: `fill={theme.colors.surface3}`.

---

## 5. Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `radius.xs` | 4px | Status badges, small chips |
| `radius.sm` | 6px | Inline tags |
| `radius.md` | 10px | All buttons, form inputs |
| `radius.lg` | 16px | Cards, pricing panels, testimonial tiles |
| `radius.xl` | 24px | Product screenshot panels, large modal sheets |
| `radius.xxl` | 32px | Oversized CTA banners (rare) |
| `radius.pill` | 999px | Toggle tabs, status pills, avatar circles |

---

## 6. Do's and Don'ts

### Do
- Use `theme.colors.canvas` (`#FFFFFF`) as the screen root background at all times.
- Use the four-step surface ladder (`surface1` → `surface4`) for depth — never skip levels.
- Reserve `theme.colors.primary` for: brand mark, primary CTA, active route, focus ring, link emphasis.
- Keep the gray tonal family cool (blue-gray bias) — not warm.
- Pair `ink` (#1A1A2E) for headlines with `inkSubtle` (#8A8A9A) for secondary text.
- Apply `primarySoft` (#FFE3EC) as badge/pill backgrounds, never as a card surface.

### Don't
- Don't hardcode any color literal in components.
- Don't introduce a second chromatic accent (no orange, green, blue for marketing).
- Don't use pink as a section background, card fill, or atmospheric gradient.
- Don't use warm grays (beige/yellow tint) — the surface ladder is strictly cool-gray.
- Don't apply `surface4` as a card background — it's reserved for pressed/deepest states.
- Don't combine multiple pink elements in the same visual cluster.
- Don't use emoji or emoticon characters anywhere in UI-rendered components or data.

---

## 7. Iconography — SVG Only, No Emoji

### Rule
- **Zero emoji or emoticon characters** in any UI-rendered `<Text>`, SVG `<Text>`, data file `icon` field, or button label.
- All icons must be **SVG-based** — either inline `react-native-svg` paths or components from an approved icon library.
- Icon `fill` and `stroke` must bind to `theme.colors.*` — never hardcoded.

### Approved Free-Tier SVG Icon Sources

| Source | URL | Use Case |
|---|---|---|
| Lucide | https://lucide.dev/icons/ | Primary — navigation, UI actions, facilities |
| Heroicons | https://heroicons.com/ | Secondary — UI actions, directional |
| Huge Icons | https://hugeicons.com/icons/ | Supplementary — specialized facility icons |
| The SVG | https://thesvg.org/ | Supplementary — decorative / unique icons |
| Simple Icons | https://simpleicons.org/ | Brand logos only |

### Icon Sizing Scale

| Context | Size | Example |
|---|---|---|
| Inline button label | 16px | Play, Pause, Stop buttons |
| List row icon | 20px | PlaceSheet room/facility rows |
| Badge / header icon | 24px | DestinationBar target badge |
| Map label prefix | 14px | FloorPlanMap origin/dest labels |

### Emoji-to-SVG Migration Map

| Current Emoji | Replacement SVG (Lucide name) | Context |
|---|---|---|
| `📍` | `map-pin` | Origin marker, "I'm here" |
| `🎯` | `crosshair` / `target` | Destination marker |
| `⬆️` | `arrow-up` | Walk straight |
| `⬅️` | `arrow-left` | Turn left |
| `➡️` | `arrow-right` | Turn right |
| `🏁` | `flag` | Arrive / finish |
| `▶` | `play` | Start simulation |
| `⏸` | `pause` | Pause simulation |
| `⏹` | `square` | Stop tracking |
| `⇄` | `arrow-left-right` | Swap origin/dest |
| `✕` | `x` | Close / dismiss |
| `📡` | `satellite` / `radio` | GPS mode |
| `👣` | `footprints` | Foot/step mode |
| `🛏️` | `bed-double` | Room |
| `👔` | `briefcase` | RA Office |
| `🧹` | `brush` / `spray-can` | Janitor |
| `🍳` | `cooking-pot` / `utensils` | Kitchen |
| `🥤` | `cup-soda` | Vending |
| `🧺` | `shirt` / `washing-machine` | Laundry |
| `🕊️` | `heart` / `hand` | Prayer room |
| `🚹` | `user` | Restroom M |
| `🚺` | `user` | Restroom F |
| `🪜` | `stairs` | Stairs |
| `📚` | `book-open` | Study hall |
| `🛗` | `arrow-up-down` | Elevator |
| `🛋️` | `sofa` | Lounge |
| `🚪` | `door-open` | Exit |
| `✨` | `sparkles` | Facility (generic) |

### Sourcing Rules
- Fetch only the specific SVG paths needed — do not bundle full icon sets.
- Prefer Lucide first (tree-shakeable, consistent 24px grid, MIT license).
- When Lucide lacks an icon, check Heroicons, then Huge Icons, then The SVG.
- Simple Icons for brand marks only (e.g., Wi-Fi brand logo).
- All icon components receive `color` prop from `theme.colors.*` and `size` from the sizing scale above.
