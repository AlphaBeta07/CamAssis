import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { Landmark, AlignmentStatus } from '../../types';
import { SKELETON_CONNECTIONS, isLandmarkReliable } from '../../ai/landmarks';
import { colors } from '../../theme';

interface SkeletonOverlayProps {
  landmarks?: Landmark[];
  width: number;
  height: number;
  status?: AlignmentStatus;
  opacity?: number;
  isGhostReference?: boolean;
}

export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  landmarks,
  width,
  height,
  status = 'Getting Closer',
  opacity = 0.8,
  isGhostReference = false,
}) => {
  if (!landmarks || landmarks.length === 0 || width <= 0 || height <= 0) {
    return null;
  }

  let boneColor = colors.white;
  let jointColor = colors.pixelYellow;

  if (isGhostReference) {
    boneColor = 'rgba(255, 255, 255, 0.85)';
    jointColor = colors.pixelYellow;
  } else {
    switch (status) {
      case 'Great Match':
        boneColor = colors.pixelGreen;
        jointColor = colors.pixelGreen;
        break;
      case 'Getting Closer':
        boneColor = colors.pixelYellow;
        jointColor = colors.pixelYellow;
        break;
      case 'Needs Adjustment':
      default:
        boneColor = 'rgba(255, 255, 255, 0.7)';
        jointColor = colors.error;
        break;
    }
  }

  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Draw Bones (Skeletal Connections) */}
        {SKELETON_CONNECTIONS.map(([idxA, idxB], i) => {
          const pA = landmarks[idxA];
          const pB = landmarks[idxB];

          if (!isLandmarkReliable(pA) || !isLandmarkReliable(pB)) {
            return null;
          }

          return (
            <Line
              key={`bone-${i}`}
              x1={pA.x * width}
              y1={pA.y * height}
              x2={pB.x * width}
              y2={pB.y * height}
              stroke={boneColor}
              strokeWidth={isGhostReference ? 2.5 : 3.5}
              strokeLinecap="square"
              strokeDasharray={isGhostReference ? '6, 4' : undefined}
            />
          );
        })}

        {/* Draw Joint Dots (Pixel-style squares!) */}
        {landmarks.map((p, idx) => {
          if (!isLandmarkReliable(p)) return null;

          const isKeyJoint = idx === 0 || (idx >= 11 && idx <= 28);
          if (!isKeyJoint) return null;

          const size = isGhostReference ? 7 : 9;
          const x = p.x * width - size / 2;
          const y = p.y * height - size / 2;

          return (
            <Rect
              key={`joint-${idx}`}
              x={x}
              y={y}
              width={size}
              height={size}
              fill={jointColor}
              stroke={colors.borderPrimary}
              strokeWidth={1.5}
            />
          );
        })}
      </Svg>
    </View>
  );
};
