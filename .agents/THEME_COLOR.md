/*
 * File: THEME_COLOR.md
 * Created: 2026-09-29 05:45 PM
 * Last Modified: 2026-09-29 05:45 PM
 */

# Indoor Navigation System — Design System & Theme Specification

> **Single Source of Truth:** [`indoor-navigator/src/theme.ts`](file:///C:/Users/chris/OneDrive/Desktop/Indoor%20Navigation%20App/indoor-navigator/src/theme.ts)  
> **Philosophy:** Linear design-system shading philosophy adapted for light mode.  
> **Palette Triad:** White Canvas Anchor + Cool-Gray Surface Ladder + Chromatic Pink Accent (+ Institutional Blue & Amber Accents).

---

## 1. Executive Summary & Core Shading Philosophy

The GuideMe-NEU / Indoor Navigation System uses a refined, modern light-mode design system. Instead of relying on heavy drop shadows or generic primary colors, visual depth, hierarchy, and interaction states are achieved through:

1. **Pure Canvas Anchor (`#FFFFFF`)**: The root canvas is pure white, establishing the highest baseline brightness.
2. **Cool-Gray Surface Ladder**: Surfaces lift off the canvas through four precise tonal steps (`surface1` → `surface4`). Each step shifts approximately −4 to −7 lightness points with a cool blue-gray desaturation (~230° hue). Warm grays (beige, yellow, brown) are strictly forbidden.
3. **Hairline Borders as Structure**: Subtle 1px borders (`hairline`, `hairlineStrong`, `hairlineTertiary`) carry visual boundaries and card structures, keeping the interface crisp, lightweight, and modern.
4. **Ink Typography Gradient**: High-contrast, indigo-tinted dark values (`ink` `#1A1A2E`) ensure WCAG AAA readability while resonating with the pink and cool-gray palette.
5. **Scarcity of Chromatic Pink Accent (`#FF5C8A`)**: Pink is the sole high-saturation brand accent. It is reserved exclusively for primary calls-to-action (CTAs), the active indoor route path, brand badges, and focus rings. It is never used as a full card or section background.
6. **Institutional Identity & Role Accents**: Specialized deep blue tokens (`brandBlue` `#1D4ED8`) provide formal institutional branding for New Era University workspace actions, while amber tokens (`accentAmber` `#B45309`) denote guest-tier access.
7. **Architectural Floorplan Geometry**: The SVG map canvas uses dedicated architectural tokens (`hallway`, `roomFill`, `roomBorder`) to ensure instant contrast between walkable corridors and enclosed spaces.

---

## 2. Complete Color Token Reference

### 2.1 Canvas & Surface Ladder

Depth is expressed through elevation tiers. **Never skip levels** in the hierarchy.

| Swatch | Token | Hex | RGB | HSL | Role & Usage Guidelines |
|:---:|---|---|---|---|---|
| <span style="display:inline-block;width:16px;height:16px;background-color:#FFFFFF;border:1px solid #D1D3DC;border-radius:3px;"></span> | `canvas` | `#FFFFFF` | `255, 255, 255` | `0°, 0%, 100%` | **Root screen background.** Pure white base for all views and floorplans. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#F7F8FA;border:1px solid #D1D3DC;border-radius:3px;"></span> | `surface1` | `#F7F8FA` | `247, 248, 250` | `220°, 20%, 97%` | **1-Step Lift.** Standard cards, bottom sheets, floating panels, map controls. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#F0F1F5;border:1px solid #D1D3DC;border-radius:3px;"></span> | `surface2` | `#F0F1F5` | `240, 241, 245` | `228°, 20%, 95%` | **2-Step Lift.** Hovered cards, active panels, elevated chips, active tab segments. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#E8E9EF;border:1px solid #D1D3DC;border-radius:3px;"></span> | `surface3` | `#E8E9EF` | `232, 233, 239` | `231°, 18%, 92%` | **3-Step Lift.** Sub-navigation headers, search dropdown containers, tag backgrounds. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#DEDFE6;border:1px solid #D1D3DC;border-radius:3px;"></span> | `surface4` | `#DEDFE6` | `222, 223, 230` | `233°, 14%, 89%` | **4-Step Lift.** Deepest lifted surface, pressed tiles, active control toggles. |

---

### 2.2 Hairline Borders

Borders replace heavy shadows to define crisp, architectural separation.

| Swatch | Token | Hex | RGB | HSL | Role & Usage Guidelines |
|:---:|---|---|---|---|---|
| <span style="display:inline-block;width:16px;height:16px;background-color:#E5E7EB;border:1px solid #D1D3DC;border-radius:3px;"></span> | `hairline` | `#E5E7EB` | `229, 231, 235` | `220°, 13%, 91%` | **Standard 1px border.** Card outlines, list item dividers, modal borders. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#D1D3DC;border:1px solid #A0A4B8;border-radius:3px;"></span> | `hairlineStrong` | `#D1D3DC` | `209, 211, 220` | `229°, 14%, 84%` | **Emphasized border.** Focused input fields, active/selected card perimeters. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#EDEEF1;border:1px solid #D1D3DC;border-radius:3px;"></span> | `hairlineTertiary` | `#EDEEF1` | `237, 238, 241` | `225°, 11%, 94%` | **Subtle border.** Nested card dividers, secondary pill outlines. |

---

### 2.3 Ink (Typography & Iconography) Hierarchy

Anchored in near-black with a faint indigo tint (~240° hue), harmonizing with the cool-gray surfaces and pink accents.

| Swatch | Token | Hex | RGB | Contrast vs Canvas | Role & Usage Guidelines |
|:---:|---|---|---|:---:|---|
| <span style="display:inline-block;width:16px;height:16px;background-color:#1A1A2E;border-radius:3px;"></span> | `ink` | `#1A1A2E` | `26, 26, 46` | **15.8:1** (AAA) | **Headlines & Primary Labels.** Main headers, primary buttons, active icons. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#4A4A5A;border-radius:3px;"></span> | `inkMuted` | `#4A4A5A` | `74, 74, 90` | **7.5:1** (AAA) | **Body & Route Instructions.** Turn-by-turn text, distances, secondary labels. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#8A8A9A;border-radius:3px;"></span> | `inkSubtle` | `#8A8A9A` | `138, 138, 154` | **3.8:1** (AA Large) | **Tertiary Text.** Deselected tab icons, timestamps, footer links, helper text. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#ADADBD;border-radius:3px;"></span> | `inkTertiary` | `#ADADBD` | `173, 173, 189` | **2.2:1** | **Ghost / Disabled.** Disabled buttons, input placeholder text, inactive dots. |

---

### 2.4 Chromatic Pink Accent (Brand & Navigation)

The sole high-chroma accent color in the core UI. Kept scarce to maintain high impact.

| Swatch | Token | Hex / Value | RGB | Role & Usage Guidelines |
|:---:|---|---|---|---|
| <span style="display:inline-block;width:16px;height:16px;background-color:#FF5C8A;border-radius:3px;"></span> | `primary` | `#FF5C8A` | `255, 92, 138` | **Primary Brand Accent.** Primary CTA button fill, active route line, brand mark. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#FF7DA3;border-radius:3px;"></span> | `primaryHover` | `#FF7DA3` | `255, 125, 163` | **Hover State.** Lighter (+15 lightness), interactive pointer feedback. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#F04878;border-radius:3px;"></span> | `primaryFocus` | `#F04878` | `240, 72, 120` | **Pressed / Active State.** Deeper (−8 lightness), focus rings, active step kicker. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#FFE3EC;border:1px solid #FF7DA3;border-radius:3px;"></span> | `primarySoft` | `#FFE3EC` | `255, 227, 236` | **Accent Tint Surface.** Badge backgrounds, "Recents" pill fill, category chip tint. |
| <span style="display:inline-block;width:16px;height:16px;background-color:rgba(255,92,138,0.18);border:1px solid #FF5C8A;border-radius:3px;"></span> | `primaryGlow` | `rgba(255,92,138,0.18)` | Alpha 18% | **Active Route Halo.** Atmospheric glow behind active SVG route polylines. |

> [!WARNING]
> **Strict Rule:** Never use `primary` (`#FF5C8A`) as a large container background, screen section fill, or body text color. Pink must remain a focused accent.

---

### 2.5 Semantic & Institutional Identity Tokens

| Swatch | Token | Hex | RGB | Role & Usage Guidelines |
|:---:|---|---|---|---|
| <span style="display:inline-block;width:16px;height:16px;background-color:#22C55E;border-radius:3px;"></span> | `success` | `#22C55E` | `34, 197, 94` | **Success / Origin.** Start pin, departure point, online sensor indicator. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#E8F9EF;border:1px solid #22C55E;border-radius:3px;"></span> | `successSoft` | `#E8F9EF` | `232, 249, 239` | **Success Surface Tint.** Background fill for success badges and origin tags. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#F59E0B;border-radius:3px;"></span> | `warning` | `#F59E0B` | `245, 158, 11` | **Warning.** Weak GPS / PDR fix, caution checkpoints, rerouting notification. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#DC2626;border-radius:3px;"></span> | `error` | `#DC2626` | `220, 38, 38` | **Error & Obstacles.** Destination inaccessible, sensor error, alert toast. |
| <span style="display:inline-block;width:16px;height:16px;background-color:rgba(0,0,0,0.40);border-radius:3px;"></span> | `overlay` | `rgba(0,0,0,0.40)` | Alpha 40% | **Modal Scrim.** Dark backdrop for bottom sheets, modal dialogs, search overlay. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#1D4ED8;border-radius:3px;"></span> | `brandBlue` | `#1D4ED8` | `29, 78, 216` | **NEU Institutional Blue.** Primary login button for `@neu.edu.ph` accounts. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#1E40AF;border-radius:3px;"></span> | `brandBlueDark` | `#1E40AF` | `30, 64, 175` | **NEU Blue Pressed.** Hover / pressed state for institutional CTAs. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#EFF6FF;border:1px solid #DBEAFE;border-radius:3px;"></span> | `brandBlueSoft` | `#EFF6FF` | `239, 246, 255` | **NEU Blue Surface Tint.** Institutional card fill, university badge background. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#DBEAFE;border-radius:3px;"></span> | `brandBlueBorder` | `#DBEAFE` | `219, 234, 254` | **NEU Blue Hairline.** Border outline for student/faculty cards. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#B45309;border-radius:3px;"></span> | `accentAmber` | `#B45309` | `180, 83, 9` | **Guest Tier Accent.** Guest access badge text, visitor shortcut highlights. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#FEF3C7;border:1px solid #B45309;border-radius:3px;"></span> | `accentAmberSoft` | `#FEF3C7` | `254, 243, 199` | **Guest Surface Tint.** Background fill for guest notification pills. |

---

### 2.6 Floorplan Architectural Map Surfaces

Dedicated map canvas tokens calibrated for high visual contrast between corridors and architectural rooms:

| Swatch | Token | Hex | RGB | Role & Usage Guidelines |
|:---:|---|---|---|---|
| <span style="display:inline-block;width:16px;height:16px;background-color:#EEF0F4;border:1px solid #CBD0DC;border-radius:3px;"></span> | `hallway` | `#EEF0F4` | `238, 240, 244` | **Corridor / Hallway Fill.** Cool architectural gray representing walkable paths. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#FFFFFF;border:1px solid #CBD0DC;border-radius:3px;"></span> | `roomFill` | `#FFFFFF` | `255, 255, 255` | **Room Interior Fill.** Pure white canvas level so rooms pop crisp against hallways. |
| <span style="display:inline-block;width:16px;height:16px;background-color:#CBD0DC;border-radius:3px;"></span> | `roomBorder` | `#CBD0DC` | `203, 208, 220` | **Architectural Wall Stroke.** Crisp perimeter strokes defining room walls. |

---

### 2.7 Backward-Compatible Legacy Aliases

For existing code migrating to the new design tokens:

| Legacy Token | Modern Token Equivalent | Value | Migration Action |
|---|---|---|---|
| `white` | `canvas` | `#FFFFFF` | Replace with `theme.colors.canvas` |
| `grayBg` | `surface1` | `#F7F8FA` | Replace with `theme.colors.surface1` |
| `grayBorder` | `hairline` | `#E5E7EB` | Replace with `theme.colors.hairline` |
| `grayChip` | `hairlineTertiary` | `#EDEEF1` | Replace with `theme.colors.hairlineTertiary` |
| `muted` | `inkSubtle` | `#8A8A9A` | Replace with `theme.colors.inkSubtle` |
| `pink` | `primary` | `#FF5C8A` | Replace with `theme.colors.primary` |
| `pinkDark` | `primaryFocus` | `#F04878` | Replace with `theme.colors.primaryFocus` |
| `pinkSoft` | `primarySoft` | `#FFE3EC` | Replace with `theme.colors.primarySoft` |
| `pinkGlow` | `primaryGlow` | `rgba(255,92,138,0.18)` | Replace with `theme.colors.primaryGlow` |
| `activeTint` | `primarySoft` (or variant) | `#FFF0F5` | Use `theme.colors.primarySoft` |

---

## 3. Elevation & Shadow System

Depth in GuideMe-NEU is primarily established through **surface levels + hairline borders**. Shadows are used sparingly as decorative warmth.

```ts
theme.shadow = {
  card: {
    shadowColor: '#FF5C8A', // Pink-tinted warmth
    shadowOpacity: 0.10,    // Subtle 10% opacity
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,           // Android elevation
  },
  lifted: {
    shadowColor: '#1A1A2E', // Neutral ink shadow
    shadowOpacity: 0.06,    // Ultra-subtle 6% opacity
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,           // Android elevation
  },
}
```

- **`shadow.card`**: Applied to primary floating action cards, turn-by-turn route cards, and featured modals.
- **`shadow.lifted`**: Applied to secondary dropdowns, map zoom controls, and non-accent overlay elements.
- **Rule:** Never combine a dark shadow with a deep surface tier on the same component.

---

## 4. Border Radius Scale

Consistent corner curvature mirrors the modern, rounded-geometry aesthetic:

| Token | Value | Target Components |
|---|:---:|---|
| `radius.xs` | `4px` | Status badges, category mini-chips, tag indicators |
| `radius.sm` | `6px` | Inline code blocks, floor level badges, secondary tags |
| `radius.md` | `10px` | Standard buttons, search inputs, dropdown menus, text fields |
| `radius.lg` | `16px` | Floating cards, route summary cards, search modal dialogs |
| `radius.xl` | `24px` | Bottom sheets, major container surfaces, hero panels |
| `radius.xxl` | `32px` | Oversized CTA banners, promotional tiles (rare) |
| `radius.pill` | `999px` | Floor switcher pills, toggle tabs, user avatar circles, status chips |

---

## 5. Spacing System (4px Base Grid)

All layout paddings, margins, and gaps must follow the 4px geometric scale:

```ts
theme.spacing = {
  xxs:     4,   // Micro gap between icon and label
  xs:      8,   // Internal chip padding, tight list gap
  sm:      12,  // Input field vertical padding, badge spacing
  md:      16,  // Standard card padding, screen horizontal gutter
  lg:      24,  // Section spacing, bottom sheet content margin
  xl:      32,  // Modal content separation, hero header spacing
  xxl:     48,  // Major section break
  section: 96,  // Landing/hero container section spacing
}
```

---

## 6. Iconography Rules — SVG Only, Zero Emoji

To maintain professional, institutional-grade quality:

1. **Zero Emoji in UI**: Emoji characters (`📍`, `🎯`, `⬆️`, `🚪`, etc.) are **strictly forbidden** in UI text, SVG layers, button labels, and data files.
2. **Approved Vector Sources**:
   - **Primary**: [Lucide Icons](https://lucide.dev/icons/) (clean 24px grid, MIT)
   - **Secondary**: [Heroicons](https://heroicons.com/)
   - **Specialized Facilities**: [Huge Icons](https://hugeicons.com/icons/)
   - **Brand Logos**: [Simple Icons](https://simpleicons.org/)
3. **Color Binding**: Every vector icon must bind its `fill` and/or `stroke` to `theme.colors.*`.
4. **Standard Sizing Scale**:
   - **14px**: Map label prefixes, floorplan markers
   - **16px**: Inline button icons (Play, Pause, Swap)
   - **20px**: List row icons, destination search results
   - **24px**: Header icons, floating action buttons, badge anchors

---

## 7. Implementation Examples

### 7.1 React Native / Expo (`StyleSheet.create`)

```tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from './theme';

export const RouteButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface1,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.canvas, // Pure white on primary button
    fontWeight: '600',
    fontSize: 15,
  },
  instructionText: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
```

### 7.2 Web CSS Variables (`:root`)

```css
:root {
  /* Canvas & Surface Ladder */
  --color-canvas: #FFFFFF;
  --color-surface-1: #F7F8FA;
  --color-surface-2: #F0F1F5;
  --color-surface-3: #E8E9EF;
  --color-surface-4: #DEDFE6;

  /* Hairlines */
  --color-hairline: #E5E7EB;
  --color-hairline-strong: #D1D3DC;
  --color-hairline-tertiary: #EDEEF1;

  /* Ink Hierarchy */
  --color-ink: #1A1A2E;
  --color-ink-muted: #4A4A5A;
  --color-ink-subtle: #8A8A9A;
  --color-ink-tertiary: #ADADBD;

  /* Brand Pink */
  --color-primary: #FF5C8A;
  --color-primary-hover: #FF7DA3;
  --color-primary-focus: #F04878;
  --color-primary-soft: #FFE3EC;
  --color-primary-glow: rgba(255, 92, 138, 0.18);

  /* Semantic & Brand */
  --color-success: #22C55E;
  --color-success-soft: #E8F9EF;
  --color-warning: #F59E0B;
  --color-error: #DC2626;
  --color-brand-blue: #1D4ED8;
  --color-brand-blue-soft: #EFF6FF;
  --color-accent-amber: #B45309;
  --color-accent-amber-soft: #FEF3C7;

  /* Floorplan */
  --color-hallway: #EEF0F4;
  --color-room-fill: #FFFFFF;
  --color-room-border: #CBD0DC;

  /* Radius Scale */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;
}
```

---

## 8. Design System Guardrails (Do's and Don'ts)

### ✅ Do
- **Always** use `theme.colors.canvas` (`#FFFFFF`) as root screen background.
- **Always** step up elevations sequentially (`surface1` → `surface2` → `surface3`).
- **Always** pair `ink` (`#1A1A2E`) with pure white buttons or headers for maximum contrast.
- **Always** use `theme.colors.hairline` for borders before attempting drop shadows.
- **Always** bind SVG floorplan walls and corridor polygons directly to theme tokens.
- **Always** use `primarySoft` (`#FFE3EC`) for badge and chip fills, not pure pink.

### ❌ Don't
- **Never** hardcode raw hex codes (`#fff`, `#FF5C8A`, etc.) inside component files.
- **Never** use warm grays (yellowish or brownish undertones); stick strictly to cool blue-grays.
- **Never** use `primary` pink as a background for entire cards, panels, or screens.
- **Never** introduce unapproved secondary chromatic colors (e.g. bright purple, teal).
- **Never** use emoji icons in buttons, chips, or map markers.
- **Never** combine heavy shadows with deep surface ladder steps.
