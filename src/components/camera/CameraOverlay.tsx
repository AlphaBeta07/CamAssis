import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Pose, OverlayMode, AlignmentStatus, Landmark } from '../../types';
import { SkeletonOverlay } from './SkeletonOverlay';

interface CameraOverlayProps {
  pose: Pose;
  mode: OverlayMode;
  opacity: number;
  width: number;
  height: number;
  showGuide: boolean;
  status: AlignmentStatus;
  userLandmarks?: Landmark[];
  aiCoachEnabled?: boolean;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({
  pose,
  mode,
  opacity,
  width,
  height,
  showGuide,
  status,
  userLandmarks,
  aiCoachEnabled = true,
}) => {
  if (!showGuide || !pose) return null;

  const showPhoto = mode === 'photo' || mode === 'both';
  const showOutline = mode === 'outline' || mode === 'both';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Transparent Reference Photo Overlay */}
      {showPhoto && pose.reference_image_url && (
        <View style={[StyleSheet.absoluteFill, { opacity }]}>
          <Image
            source={{ uri: pose.reference_image_url }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            priority="high"
          />
        </View>
      )}

      {/* 2. Target Pose Skeleton Outline */}
      {showOutline && pose.landmarks && pose.landmarks.length > 0 && (
        <SkeletonOverlay
          landmarks={pose.landmarks}
          width={width}
          height={height}
          isGhostReference={true}
          opacity={Math.min(1.0, opacity + 0.35)}
        />
      )}

      {/* 3. Live User Skeleton (if AI Coach enabled & detected) */}
      {aiCoachEnabled && userLandmarks && userLandmarks.length > 0 && (
        <SkeletonOverlay
          landmarks={userLandmarks}
          width={width}
          height={height}
          status={status}
          isGhostReference={false}
          opacity={0.85}
        />
      )}
    </View>
  );
};
