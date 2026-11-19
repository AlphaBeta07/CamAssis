import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { FramingGuide as FramingGuideType } from '../../types';
import { colors } from '../../theme';

interface FramingGuideProps {
  guideType: FramingGuideType;
  showGrid?: boolean;
  width: number;
  height: number;
}

export const FramingGuideOverlay: React.FC<FramingGuideProps> = ({
  guideType,
  showGrid = false,
  width,
  height,
}) => {
  if (width <= 0 || height <= 0) return null;

  const strokeColor = 'rgba(255, 255, 255, 0.4)';
  const activeColor = colors.pixelYellow;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* 3x3 Rule of Thirds Grid */}
        {showGrid && (
          <>
            <Line x1={width / 3} y1={0} x2={width / 3} y2={height} stroke={strokeColor} strokeWidth={1} />
            <Line x1={(2 * width) / 3} y1={0} x2={(2 * width) / 3} y2={height} stroke={strokeColor} strokeWidth={1} />
            <Line x1={0} y1={height / 3} x2={width} y2={height / 3} stroke={strokeColor} strokeWidth={1} />
            <Line x1={0} y1={(2 * height) / 3} x2={width} y2={(2 * height) / 3} stroke={strokeColor} strokeWidth={1} />
          </>
        )}

        {/* Center Crosshair Guide */}
        {guideType === 'center' && (
          <>
            <Line
              x1={width / 2 - 20}
              y1={height / 2}
              x2={width / 2 + 20}
              y2={height / 2}
              stroke={activeColor}
              strokeWidth={2}
            />
            <Line
              x1={width / 2}
              y1={height / 2 - 20}
              x2={width / 2}
              y2={height / 2 + 20}
              stroke={activeColor}
              strokeWidth={2}
            />
          </>
        )}

        {/* Full-Body Framing Guide */}
        {guideType === 'full-body' && (
          <>
            <Rect
              x={width * 0.15}
              y={height * 0.08}
              width={width * 0.7}
              height={height * 0.84}
              stroke={activeColor}
              strokeWidth={2}
              strokeDasharray="8, 6"
              fill="transparent"
              rx={2}
            />
            {/* Head zone */}
            <Line
              x1={width * 0.3}
              y1={height * 0.22}
              x2={width * 0.7}
              y2={height * 0.22}
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth={1.5}
              strokeDasharray="4, 4"
            />
          </>
        )}

        {/* Upper-Body Framing Guide */}
        {guideType === 'upper-body' && (
          <>
            <Rect
              x={width * 0.12}
              y={height * 0.1}
              width={width * 0.76}
              height={height * 0.58}
              stroke={activeColor}
              strokeWidth={2}
              strokeDasharray="8, 6"
              fill="transparent"
              rx={2}
            />
            {/* Eye level line */}
            <Line
              x1={width * 0.2}
              y1={height * 0.25}
              x2={width * 0.8}
              y2={height * 0.25}
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth={1.5}
              strokeDasharray="4, 4"
            />
          </>
        )}
      </Svg>
    </View>
  );
};
