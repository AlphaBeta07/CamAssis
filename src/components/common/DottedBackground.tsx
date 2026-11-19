import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';
import { colors } from '../../theme';

interface DottedBackgroundProps extends ViewProps {
  children?: React.ReactNode;
  dotColor?: string;
  dotOpacity?: number;
  dotSize?: number;
  gap?: number;
  backgroundColor?: string;
}

export function DottedBackground({
  children,
  style,
  dotColor = colors.pixelGreen,
  dotOpacity = 0.18,
  dotSize = 1.6,
  gap = 20,
  backgroundColor = colors.cream,
  ...props
}: DottedBackgroundProps) {
  return (
    <View style={[styles.container, { backgroundColor }, style]} {...props}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="dotted-grid"
              x="0"
              y="0"
              width={gap}
              height={gap}
              patternUnits="userSpaceOnUse"
            >
              <Circle
                cx={gap / 2}
                cy={gap / 2}
                r={dotSize}
                fill={dotColor}
                opacity={dotOpacity}
              />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dotted-grid)" />
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
