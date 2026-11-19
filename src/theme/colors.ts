/**
 * CamAssis — Life at FlytBase Retro Pixel Brutalist Theme
 * Color tokens inspired by https://www.lifeatflytbase.com/
 */

export const colors = {
  // Primary backgrounds & surfaces
  cream: '#E8E3CF',
  creamLight: '#F3F0E4',
  white: '#FFFFFF',

  // Brand color blocks
  pixelYellow: '#F2C202', // Primary actions, key CTAs, shutter button
  pixelOrange: '#F28C28', // Featured blocks, secondary highlights
  pixelBlue: '#0797CF',   // Technical, links, information
  pixelGreen: '#087A3B',  // AI alignment, success, active states, dotted grid

  // Typography
  inkPrimary: '#30251D',   // Deep brutalist dark brown
  inkSecondary: '#3C1C11', // Dark warm brown for secondary copy
  inkInverse: '#FFFFFF',   // White text on dark/colored cards

  // Borders & Outlines
  borderPrimary: '#30251D',
  borderGreen: '#087A3B',
  borderYellow: '#F2C202',

  // Functional
  success: '#087A3B',
  error: '#C83B32',
  warning: '#F2C202',
  information: '#0797CF',

  // Dotted Grid
  gridDot: 'rgba(8, 122, 59, 0.22)',
  gridDotMuted: 'rgba(48, 37, 29, 0.14)',

  // Transparent / Utility
  transparent: 'transparent',
  black: '#000000',
};

// Mapped into palette for full backwards compatibility
export const palette = {
  // Brand
  primary: colors.pixelYellow,
  primarySoft: colors.creamLight,
  primaryDark: '#D4A800',
  accent: colors.pixelBlue,
  accentSoft: '#D7F1FA',
  secondary: colors.pixelOrange,
  tertiary: colors.pixelGreen,

  // FlytBase specifics
  cream: colors.cream,
  creamLight: colors.creamLight,
  pixelYellow: colors.pixelYellow,
  pixelOrange: colors.pixelOrange,
  pixelBlue: colors.pixelBlue,
  pixelGreen: colors.pixelGreen,

  // Backgrounds & Surfaces
  background: colors.cream,
  surface: colors.creamLight,
  surfaceElevated: colors.white,
  surfaceSoft: colors.cream,
  border: colors.borderPrimary,
  borderSoft: colors.borderPrimary,

  // Text
  textPrimary: colors.inkPrimary,
  textSecondary: colors.inkSecondary,
  textMuted: '#685950',
  textInverse: colors.inkInverse,

  // AI Alignment Status (Retro Brutalist indicators)
  statusNeedsAdjustment: colors.error,       // Red #C83B32
  statusNeedsAdjustmentSoft: '#FBDCDA',
  statusGettingCloser: colors.pixelYellow,   // Yellow #F2C202
  statusGettingCloserSoft: '#FDF3C2',
  statusGreatMatch: colors.pixelGreen,       // Green #087A3B
  statusGreatMatchSoft: '#C2E5D0',

  // Camera UI
  cameraOverlay: 'rgba(48, 37, 29, 0.65)',
  cameraControlsBg: '#30251D',
  shutterBorder: colors.inkPrimary,
  shutterFill: colors.pixelYellow,
  white: colors.white,
  black: colors.black,
  transparent: colors.transparent,
};

export const darkPalette = palette;
