import { Platform } from 'react-native';
import { colors, palette, darkPalette } from './colors';

export { colors, palette, darkPalette };

export const fonts = {
  pixel: 'PressStart2P_400Regular',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
  // System fallbacks
  fallbackMono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// Brutalist square & sharp corners
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  full: 9999, // Only used for circular avatars/lenses
};

export const borders = {
  thin: 1.5,
  regular: 2,
  thick: 3,
  heavy: 4,
  color: colors.borderPrimary,
};

// Hard offset brutalist shadows (Zero Blur)
export const shadows = {
  hardXs: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  hardSm: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  hard: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hardLg: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  // Colored hard offset shadows
  hardYellow: {
    shadowColor: colors.pixelYellow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hardOrange: {
    shadowColor: colors.pixelOrange,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hardBlue: {
    shadowColor: colors.pixelBlue,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hardGreen: {
    shadowColor: colors.pixelGreen,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  // Backwards compatibility aliases
  subtle: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  card: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  elevated: {
    shadowColor: colors.borderPrimary,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  pinkGlow: {
    shadowColor: colors.pixelYellow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
};

export const typography = {
  // Pixel display headings (Short & impactful)
  pixelDisplay: {
    fontFamily: fonts.pixel,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.5,
    color: colors.inkPrimary,
  },
  pixelTitle1: {
    fontFamily: fonts.pixel,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: colors.inkPrimary,
  },
  pixelTitle2: {
    fontFamily: fonts.pixel,
    fontSize: 14,
    lineHeight: 22,
    color: colors.inkPrimary,
  },
  pixelBadge: {
    fontFamily: fonts.pixel,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.5,
  },

  // Monospace body & UI typography
  monoHero: {
    fontFamily: fonts.monoBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.inkPrimary,
  },
  titleHero: {
    fontFamily: fonts.monoBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: colors.inkPrimary,
  },
  title1: {
    fontFamily: fonts.monoBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.inkPrimary,
  },
  title2: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.inkPrimary,
  },
  title3: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.inkPrimary,
  },
  headline: {
    fontFamily: fonts.monoMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.inkPrimary,
  },
  body: {
    fontFamily: fonts.mono,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkPrimary,
  },
  bodySmall: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 18,
    color: colors.inkSecondary,
  },
  caption: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    color: colors.inkSecondary,
  },
  tiny: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
};
