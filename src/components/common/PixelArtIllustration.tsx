import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, G, Path } from 'react-native-svg';
import { colors } from '../../theme';

interface PixelArtIllustrationProps {
  type: 'hero-camera' | 'pose-guide' | 'empty-photos' | 'ai-coach' | 'stars';
  size?: number;
}

export const PixelArtIllustration: React.FC<PixelArtIllustrationProps> = ({
  type,
  size = 120,
}) => {
  switch (type) {
    case 'hero-camera':
      // 16x16 pixel retro camera
      return (
        <View style={[styles.container, { width: size, height: size * 0.85 }]}>
          <Svg viewBox="0 0 32 28" width="100%" height="100%">
            {/* Camera Body Drop Shadow */}
            <Rect x="4" y="8" width="26" height="18" fill={colors.borderPrimary} />
            {/* Top flash / shutter shadow */}
            <Rect x="8" y="4" width="7" height="4" fill={colors.borderPrimary} />
            <Rect x="18" y="2" width="6" height="6" fill={colors.borderPrimary} />

            {/* Shutter Button (Yellow) */}
            <Rect x="6" y="3" width="7" height="4" fill={colors.pixelYellow} stroke={colors.borderPrimary} strokeWidth="1" />

            {/* Flash unit (Orange) */}
            <Rect x="17" y="1" width="6" height="5" fill={colors.pixelOrange} stroke={colors.borderPrimary} strokeWidth="1" />
            <Rect x="19" y="2" width="2" height="2" fill={colors.white} />

            {/* Camera Main Body (Cream Light) */}
            <Rect x="2" y="6" width="26" height="18" fill={colors.creamLight} stroke={colors.borderPrimary} strokeWidth="1.5" />

            {/* Color Accent Stripe (Blue & Green) */}
            <Rect x="3" y="10" width="24" height="2.5" fill={colors.pixelBlue} />
            <Rect x="3" y="12.5" width="24" height="2" fill={colors.pixelGreen} />

            {/* Lens Outer Ring (Dark Ink) */}
            <Rect x="10" y="9" width="10" height="10" fill={colors.borderPrimary} />

            {/* Lens Middle (Yellow) */}
            <Rect x="11.5" y="10.5" width="7" height="7" fill={colors.pixelYellow} />

            {/* Lens Inner Glass (Blue & White reflection) */}
            <Rect x="13" y="12" width="4" height="4" fill={colors.pixelBlue} />
            <Rect x="13.5" y="12.5" width="1.5" height="1.5" fill={colors.white} />

            {/* Viewfinder window */}
            <Rect x="5" y="8" width="3" height="2" fill={colors.pixelGreen} stroke={colors.borderPrimary} strokeWidth="0.5" />

            {/* Corner Grip Dots */}
            <Rect x="23" y="16" width="1.5" height="1.5" fill={colors.borderPrimary} />
            <Rect x="25" y="16" width="1.5" height="1.5" fill={colors.borderPrimary} />
            <Rect x="23" y="19" width="1.5" height="1.5" fill={colors.borderPrimary} />
            <Rect x="25" y="19" width="1.5" height="1.5" fill={colors.borderPrimary} />
          </Svg>
        </View>
      );

    case 'pose-guide':
      // 8-bit human pose stick-skeleton
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Svg viewBox="0 0 32 32" width="100%" height="100%">
            {/* Guide Grid Box */}
            <Rect x="2" y="2" width="28" height="28" fill={colors.creamLight} stroke={colors.borderPrimary} strokeWidth="1.5" />
            <Path d="M2 16 H30 M16 2 V30" stroke={colors.pixelGreen} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />

            {/* Head */}
            <Rect x="14" y="5" width="4" height="4" fill={colors.pixelYellow} stroke={colors.borderPrimary} strokeWidth="0.8" />
            {/* Spine */}
            <Rect x="15.2" y="9" width="1.6" height="8" fill={colors.pixelGreen} />
            {/* Left Arm (raised/bent) */}
            <Rect x="10" y="10" width="5.5" height="1.6" fill={colors.pixelGreen} />
            <Rect x="9" y="6.5" width="1.6" height="4.5" fill={colors.pixelGreen} />
            {/* Right Arm (hip hand) */}
            <Rect x="16.5" y="11" width="5" height="1.6" fill={colors.pixelGreen} />
            <Rect x="20.5" y="12.5" width="1.6" height="4" fill={colors.pixelGreen} />
            {/* Left Leg */}
            <Rect x="13.5" y="17" width="1.6" height="9" fill={colors.pixelBlue} />
            <Rect x="11.5" y="25" width="3.5" height="1.6" fill={colors.pixelBlue} />
            {/* Right Leg (relaxed stance) */}
            <Rect x="17" y="17" width="3" height="1.6" fill={colors.pixelBlue} />
            <Rect x="19" y="18.5" width="1.6" height="8" fill={colors.pixelBlue} />
            <Rect x="19" y="25.5" width="3.5" height="1.6" fill={colors.pixelBlue} />

            {/* Landmark Joint Dots */}
            <Rect x="13.5" y="9.5" width="1.5" height="1.5" fill={colors.pixelOrange} />
            <Rect x="17" y="9.5" width="1.5" height="1.5" fill={colors.pixelOrange} />
            <Rect x="8.5" y="6" width="1.5" height="1.5" fill={colors.pixelOrange} />
            <Rect x="20.5" y="16" width="1.5" height="1.5" fill={colors.pixelOrange} />
            <Rect x="13.5" y="16.5" width="1.5" height="1.5" fill={colors.pixelOrange} />
            <Rect x="17.5" y="16.5" width="1.5" height="1.5" fill={colors.pixelOrange} />
          </Svg>
        </View>
      );

    case 'empty-photos':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Svg viewBox="0 0 32 32" width="100%" height="100%">
            {/* Photo frame shadow */}
            <Rect x="5" y="7" width="22" height="20" fill={colors.borderPrimary} />
            {/* White photo card */}
            <Rect x="3" y="5" width="22" height="20" fill={colors.white} stroke={colors.borderPrimary} strokeWidth="1.5" />
            {/* Inner photo image */}
            <Rect x="5" y="7" width="18" height="13" fill={colors.creamLight} stroke={colors.borderPrimary} strokeWidth="1" />
            {/* Pixel sun */}
            <Rect x="17" y="9" width="3.5" height="3.5" fill={colors.pixelYellow} />
            {/* Pixel mountains */}
            <Path d="M6 18 L10 13 L14 18 Z" fill={colors.pixelGreen} stroke={colors.borderPrimary} strokeWidth="0.8" />
            <Path d="M12 18 L17 11 L22 18 Z" fill={colors.pixelBlue} stroke={colors.borderPrimary} strokeWidth="0.8" />
            {/* Camera badge pinned to corner */}
            <Rect x="17" y="20" width="7" height="5" fill={colors.pixelOrange} stroke={colors.borderPrimary} strokeWidth="1" />
          </Svg>
        </View>
      );

    case 'ai-coach':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Svg viewBox="0 0 32 32" width="100%" height="100%">
            {/* Reticle brackets */}
            <Path d="M4 8 V4 H8" stroke={colors.pixelGreen} strokeWidth="2" fill="none" />
            <Path d="M24 4 H28 V8" stroke={colors.pixelGreen} strokeWidth="2" fill="none" />
            <Path d="M28 24 V28 H24" stroke={colors.pixelGreen} strokeWidth="2" fill="none" />
            <Path d="M8 28 H4 V24" stroke={colors.pixelGreen} strokeWidth="2" fill="none" />

            {/* Center target crosshair */}
            <Rect x="15" y="10" width="2" height="4" fill={colors.pixelYellow} />
            <Rect x="15" y="18" width="2" height="4" fill={colors.pixelYellow} />
            <Rect x="10" y="15" width="4" height="2" fill={colors.pixelYellow} />
            <Rect x="18" y="15" width="4" height="2" fill={colors.pixelYellow} />
            <Rect x="14" y="14" width="4" height="4" fill={colors.pixelOrange} stroke={colors.borderPrimary} strokeWidth="0.8" />
          </Svg>
        </View>
      );

    case 'stars':
    default:
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <G fill={colors.pixelYellow} stroke={colors.borderPrimary} strokeWidth="1">
              <Path d="M10 2 H14 V6 H18 V10 H22 V14 H18 V18 H14 V22 H10 V18 H6 V14 H2 V10 H6 V6 H10 Z" />
            </G>
            <Rect x="10" y="10" width="4" height="4" fill={colors.white} />
          </Svg>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
