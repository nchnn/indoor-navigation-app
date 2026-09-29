// ─────────────────────────────────────────────────────────────────────────────
// theme.ts — Single source of truth for all design tokens.
// Palette: white-canvas + light-gray surface ladder + pink chromatic accent.
// Follows the Linear design-system shading philosophy adapted for light mode.
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  colors: {
    // ── Canvas & Surface Ladder ──────────────────────────────────────────────
    // White is the anchor. Each step adds a faint cool-gray tint (+~7 lightness
    // points darker, +slight blue-gray desaturation) to convey depth without
    // shadows.  Never skip levels — use the ladder for hierarchy.
    canvas:   '#FFFFFF',   // Root screen background — pure white
    surface1: '#F7F8FA',   // Cards, panels, bottom sheets (1-step lift)
    surface2: '#F0F1F5',   // Featured/hovered cards, active panels (2-step)
    surface3: '#E8E9EF',   // Sub-nav, dropdowns, inline tag backgrounds (3-step)
    surface4: '#DEDFE6',   // Deepest lifted surface, pressed tiles (4-step)

    // ── Hairline Borders ─────────────────────────────────────────────────────
    // Borders carry hierarchy in place of shadows — same philosophy as Linear.
    hairline:         '#E5E7EB',  // Standard 1px card / list-item borders
    hairlineStrong:   '#D1D3DC',  // Focused input outlines, active card borders
    hairlineTertiary: '#EDEEF1',  // Nested-surface / secondary divider borders

    // ── Ink (Text) Hierarchy ─────────────────────────────────────────────────
    // Anchored in a near-black with a faint indigo tint — resonates with pink.
    ink:         '#1A1A2E',  // Headlines, primary labels, active icons
    inkMuted:    '#4A4A5A',  // Secondary text, route instructions, distances
    inkSubtle:   '#8A8A9A',  // Tertiary text, deselected tabs, footer links
    inkTertiary: '#ADADBD',  // Disabled states, footnotes, ghost placeholders

    // ── Pink — The Single Chromatic Accent ───────────────────────────────────
    // Used scarcely: brand mark, primary CTA, active route, focus ring only.
    // Do NOT use pink as a section background or surface fill.
    primary:      '#FF5C8A',              // Primary CTA, active route, brand mark
    primaryHover: '#FF7DA3',              // Hover state — lighter, +15 lightness
    primaryFocus: '#F04878',              // Pressed / focus-ring — deeper, -8 lightness
    primarySoft:  '#FFE3EC',             // Accent tint surface (badge bg, pill bg)
    primaryGlow:  'rgba(255,92,138,0.18)', // Halo behind active route paths

    // ── Semantic ─────────────────────────────────────────────────────────────
    success:      '#22C55E',  // Origin marker, departure tag, success indicator
    successSoft:  '#E8F9EF',  // Success surface tint (badge bg)
    warning:      '#F59E0B',  // Warning / weak GPS fix
    error:        '#DC2626',  // Error / alert state
    overlay:      'rgba(0,0,0,0.40)', // Modal scrim
    brandBlue:        '#1D4ED8', // Institutional primary button (NEU Workspace)
    brandBlueDark:    '#1E40AF', // Pressed state
    brandBlueSoft:    '#EFF6FF', // Light blue surface tint
    brandBlueBorder:  '#DBEAFE', // Light blue card hairline
    accentAmber:      '#B45309', // Guest access badge text
    accentAmberSoft:  '#FEF3C7', // Guest access surface tint

    // ── Floorplan Map Surfaces & Grid System ─────────────────────────────────
    // These live on the map canvas — slightly lifted from pure white so rooms
    // read against the corridor.
    hallway:            '#EEF0F4',  // Corridor / hallway surface fill (distinct contrast with white rooms)
    roomFill:           '#FFFFFF',  // Room fill — pure white (canvas level)
    roomBorder:         '#CBD0DC',  // Room boundary wall stroke (crisp architectural perimeter)
    gridBackground:     '#F4F5F8',  // Root background behind map
    gridMinor:          '#E3E6EE',  // Minor architectural grid line (high precision)
    gridMajor:          '#CAD0DC',  // Major architectural grid line (structural benchmark)
    gridDarkBackground: '#0B111E',  // Dark blueprint background (from reference)
    gridDarkMinor:      '#182338',  // Dark blueprint minor grid line
    gridDarkMajor:      '#243859',  // Dark blueprint major grid line

    // ── Legacy aliases (kept for backward-compat; prefer tokens above) ────────
    white:      '#FFFFFF',
    grayBg:     '#F7F8FA',   // → surface1
    grayBorder: '#E5E7EB',   // → hairline
    grayChip:   '#EDEEF1',   // → hairlineTertiary
    muted:      '#8A8A9A',   // → inkSubtle
    pink:       '#FF5C8A',   // → primary
    pinkDark:   '#F04878',   // → primaryFocus
    pinkSoft:   '#FFE3EC',   // → primarySoft
    pinkGlow:   'rgba(255,92,138,0.18)', // → primaryGlow
    activeTint: '#FFF0F5',   // Active item surface tint — softer than primarySoft
  },

  // ── Border Radius Scale ────────────────────────────────────────────────────
  // xs → pill mirrors the component shape vocabulary.
  radius: {
    xs:   4,    // Status badges, small chips
    sm:   6,    // Inline tags
    md:   10,   // Buttons, form inputs
    lg:   16,   // Cards, pricing panels, testimonial tiles
    xl:   24,   // Product screenshot panels, large modal sheets
    xxl:  32,   // Oversized CTA banners (rare)
    pill: 999,  // Toggle tabs, status pills, avatar circles
  },

  // ── Elevation / Shadow ────────────────────────────────────────────────────
  // On a white canvas, a soft pink-tinted shadow adds warmth without harshness.
  // Hairline borders carry most of the hierarchy; shadows are decorative only.
  shadow: {
    card: {
      shadowColor:   '#FF5C8A',  // Pink-tinted shadow — stays on brand
      shadowOpacity: 0.10,       // Subtle; white canvas needs less than dark
      shadowRadius:  12,
      shadowOffset:  { width: 0, height: 4 },
      elevation:     4,
    },
    lifted: {
      shadowColor:   '#1A1A2E',  // Neutral ink shadow for non-accent surfaces
      shadowOpacity: 0.06,
      shadowRadius:  8,
      shadowOffset:  { width: 0, height: 2 },
      elevation:     2,
    },
  },

  // ── Spacing System ─────────────────────────────────────────────────────────
  // Base unit: 4px.  Mirrors the Linear spacing vocabulary.
  spacing: {
    xxs:     4,
    xs:      8,
    sm:      12,
    md:      16,
    lg:      24,
    xl:      32,
    xxl:     48,
    section: 96,
  },
} as const;

export type Theme = typeof theme;
