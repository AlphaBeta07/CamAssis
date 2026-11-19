import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';

export interface BrandLogoProps {
  /** Size maps to width, maintaining the 400:340 (1.176) aspect ratio */
  size?: number;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 48,
  width,
  height,
  style,
}) => {
  const ASPECT_RATIO = 400 / 340;
  
  const finalWidth = width ?? (height ? height * ASPECT_RATIO : size);
  const finalHeight = height ?? finalWidth / ASPECT_RATIO;

  return (
    <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
      <Svg
        width={finalWidth}
        height={finalHeight}
        viewBox="32 40 400 340"
      >
        <G transform="translate(42, 42)">
          {/* Offset Shadow */}
          <G transform="translate(12, 12)">
            <Path
              d="M52 94h58V70h58V46h116v24h58v24h34v180h-34v34H52v-34H18V94h34z"
              fill="#30251D"
            />
          </G>

          {/* Camera Body */}
          <Path
            d="M52 94h58V70h58V46h116v24h58v24h34v180h-34v34H52v-34H18V94h34z"
            fill="#F2C202"
            stroke="#30251D"
            strokeWidth={12}
            strokeLinejoin="miter"
          />

          {/* Top Viewfinder */}
          <Path
            d="M128 46V20h116v26"
            fill="#0797CF"
            stroke="#30251D"
            strokeWidth={12}
            strokeLinejoin="miter"
          />

          {/* Lens Concentric Rings */}
          <Rect x={116} y={112} width={156} height={126} fill="#30251D" />
          <Rect x={130} y={126} width={128} height={98} fill="#0797CF" />
          <Rect x={150} y={142} width={88} height={66} fill="#F2C202" />
          <Rect x={170} y={158} width={48} height={34} fill="#30251D" />
          <Rect x={184} y={168} width={20} height={14} fill="#0797CF" />

          {/* Flash */}
          <Path
            d="M300 100h28v28h-28z"
            fill="#F28C28"
            stroke="#30251D"
            strokeWidth={8}
          />

          {/* Pixel Focus Marks */}
          <Path
            d="M0 116V84h32M316 284h32v-32M0 252v32h32M316 84h32v32"
            fill="none"
            stroke="#087A3B"
            strokeWidth={12}
          />

          {/* Shutter Button */}
          <Rect
            x={280}
            y={48}
            width={28}
            height={18}
            fill="#F28C28"
            stroke="#30251D"
            strokeWidth={7}
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
