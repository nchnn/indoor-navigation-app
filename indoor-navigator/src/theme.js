// ─────────────────────────────────────────────────────────────────────────────
// theme.js — Single source of truth for all design tokens.
// Palette: white-canvas + light-gray surface ladder + pink chromatic accent.
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  colors: {
    // ── Canvas & Surface Ladder ──────────────────────────────────────────────
    canvas:   '#FFFFFF',
    surface1: '#F7F8FA',
    surface2: '#F0F1F5',
    surface3: '#4c67ffff',
    surface4: '#DEDFE6',

    // ── Hairline Borders ─────────────────────────────────────────────────────
    hairline:         '#6a9cffff',
    hairlineStrong:   '#D1D3DC',
    hairlineTertiary: '#EDEEF1',

    // ── Ink (Text) Hierarchy ─────────────────────────────────────────────────
    ink:         '#0202cfff',
    inkMuted:    '#4A4A5A',
    inkSubtle:   '#8A8A9A',
    inkTertiary: '#ADADBD',

    // ── Pink — The Single Chromatic Accent ───────────────────────────────────
    primary:      '#FF5C8A',
    primaryHover: '#FF7DA3',
    primaryFocus: '#F04878',
    primarySoft:  '#FFE3EC',
    primaryGlow:  'rgba(255,92,138,0.18)',

    // ── Semantic ─────────────────────────────────────────────────────────────
    success:      '#22C55E',
    successSoft:  '#E8F9EF',
    warning:      '#F59E0B',
    error:        '#DC2626',
    overlay:      'rgba(0,0,0,0.40)',
    brandBlue:        '#1D4ED8',
    brandBlueDark:    '#1E40AF',
    brandBlueSoft:    '#EFF6FF',
    brandBlueBorder:  '#DBEAFE',
    accentAmber:      '#B45309',
    accentAmberSoft:  '#FEF3C7',

    // ── Floorplan Map Surfaces & Grid System ─────────────────────────────────
    hallway:            '#EEF0F4',
    roomFill:           '#FFFFFF',
    roomBorder:         '#2f52a3ff',
    gridBackground:     '#F4F5F8',
    gridMinor:          '#8f8f8fff',
    gridMajor:          '#ffffffff',
    gridDarkBackground: '#0B111E',
    gridDarkMinor:      '#182338',
    gridDarkMajor:      '#243859',

    // ── Legacy aliases ────────────────────────────────────────────────────────
    white:      '#FFFFFF',
    grayBg:     '#F7F8FA',
    grayBorder: '#E5E7EB',
    grayChip:   '#EDEEF1',
    muted:      '#8A8A9A',
    pink:       '#FF5C8A',
    pinkDark:   '#F04878',
    pinkSoft:   '#FFE3EC',
    pinkGlow:   'rgba(255,92,138,0.18)',
    activeTint: '#FFF0F5',
  },

  radius: {
    xs:   4,
    sm:   6,
    md:   10,
    lg:   16,
    xl:   24,
    xxl:  32,
    pill: 999,
  },

  shadow: {
    card: {
      shadowColor:   '#FF5C8A',
      shadowOpacity: 0.10,
      shadowRadius:  12,
      shadowOffset:  { width: 0, height: 4 },
      elevation:     4,
    },
    lifted: {
      shadowColor:   '#1A1A2E',
      shadowOpacity: 0.06,
      shadowRadius:  8,
      shadowOffset:  { width: 0, height: 2 },
      elevation:     2,
    },
  },

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
};
