import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Zap,
  ZapOff,
  SwitchCamera,
  Eye,
  EyeOff,
  Grid,
  X,
  Layers,
  Sparkles,
} from 'lucide-react-native';
import { OverlayMode, FramingGuide } from '../../types';
import { colors, fonts, shadows } from '../../theme';
import { triggerHaptic } from '../../services/haptics/haptics';

export interface CameraTopBarProps {
  onClose: () => void;
  onToggleFacing: () => void;
  onToggleFlash: () => void;
  flash: 'off' | 'on' | 'auto';
  onToggleGrid: () => void;
  showGrid: boolean;
  aiCoachEnabled: boolean;
  onToggleAiCoach: () => void;
  poseTitle?: string;
}

export const CameraTopBar: React.FC<CameraTopBarProps> = ({
  onClose,
  onToggleFacing,
  onToggleFlash,
  flash,
  onToggleGrid,
  showGrid,
  aiCoachEnabled,
  onToggleAiCoach,
  poseTitle,
}) => {
  return (
    <View style={styles.topBar}>
      <Pressable
        style={({ pressed }) => [
          styles.roundBtn,
          pressed && styles.pressed,
        ]}
        onPress={onClose}
        accessibilityLabel="Close camera"
      >
        <X size={18} color={colors.inkPrimary} strokeWidth={2.5} />
      </Pressable>

      <View style={styles.topCenterWrap}>
        <Text style={styles.topTitle} numberOfLines={1}>
          {poseTitle ? poseTitle.toUpperCase() : 'GHOST CAMERA'}
        </Text>
        <Text style={styles.topSubtitle}>AI SENSOR READY</Text>
      </View>

      <View style={styles.topRightRow}>
        {/* Flash Toggle */}
        <Pressable
          style={({ pressed }) => [
            styles.roundBtn,
            flash !== 'off' && styles.activeBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onToggleFlash();
          }}
          accessibilityLabel="Toggle flash"
        >
          {flash === 'off' ? (
            <ZapOff size={16} color={colors.inkPrimary} strokeWidth={2.5} />
          ) : (
            <Zap size={16} color={colors.inkPrimary} strokeWidth={2.5} />
          )}
        </Pressable>

        {/* Grid Toggle */}
        <Pressable
          style={({ pressed }) => [
            styles.roundBtn,
            showGrid && styles.activeBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onToggleGrid();
          }}
          accessibilityLabel="Toggle 3x3 grid"
        >
          <Grid size={16} color={colors.inkPrimary} strokeWidth={2.5} />
        </Pressable>

        {/* AI Coach Toggle */}
        <Pressable
          style={({ pressed }) => [
            styles.roundBtn,
            aiCoachEnabled && styles.activeGreenBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onToggleAiCoach();
          }}
          accessibilityLabel="Toggle AI Coach"
        >
          <Sparkles
            size={16}
            color={aiCoachEnabled ? colors.white : colors.inkPrimary}
            strokeWidth={2.5}
          />
        </Pressable>

        {/* Camera Flip */}
        <Pressable
          style={({ pressed }) => [
            styles.roundBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onToggleFacing();
          }}
          accessibilityLabel="Switch camera"
        >
          <SwitchCamera size={18} color={colors.inkPrimary} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
};

export interface CameraBottomDeckProps {
  onCapture: () => void;
  isCapturing: boolean;
  zoom: number;
  onSelectZoom: (zoom: number) => void;
  showGuide: boolean;
  onToggleGuide: () => void;
  overlayMode: OverlayMode;
  onSelectOverlayMode: (mode: OverlayMode) => void;
  opacity: number;
  onChangeOpacity: (val: number) => void;
  framingGuide: FramingGuide;
  onCycleFraming: () => void;
}

export const CameraBottomDeck: React.FC<CameraBottomDeckProps> = ({
  onCapture,
  isCapturing,
  zoom,
  onSelectZoom,
  showGuide,
  onToggleGuide,
  overlayMode,
  onSelectOverlayMode,
  opacity,
  onChangeOpacity,
  framingGuide,
  onCycleFraming,
}) => {
  const handleShutterPress = () => {
    triggerHaptic('impactHeavy');
    onCapture();
  };

  return (
    <View style={styles.bottomDeck}>
      {/* Zoom Selector */}
      <View style={styles.zoomRow}>
        {[
          { label: '0.5X', value: 0 },
          { label: '1X', value: 0.15 },
          { label: '2X', value: 0.5 },
        ].map((z) => (
          <Pressable
            key={z.label}
            style={({ pressed }) => [
              styles.zoomPill,
              zoom === z.value && styles.zoomPillActive,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              triggerHaptic('selection');
              onSelectZoom(z.value);
            }}
          >
            <Text style={[styles.zoomText, zoom === z.value && styles.zoomTextActive]}>
              {z.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Overlay Transparency Slider & Mode Selector */}
      {showGuide && (
        <View style={styles.guideControlsCard}>
          {/* Mode Pills: Photo | Outline | Both */}
          <View style={styles.modeRow}>
            {(['photo', 'outline', 'both'] as OverlayMode[]).map((m) => (
              <Pressable
                key={m}
                style={({ pressed }) => [
                  styles.modePill,
                  overlayMode === m && styles.modePillActive,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  triggerHaptic('selection');
                  onSelectOverlayMode(m);
                }}
              >
                <Text style={[styles.modeText, overlayMode === m && styles.modeTextActive]}>
                  {m.toUpperCase()}
                </Text>
              </Pressable>
            ))}

            <View style={styles.opacityBadge}>
              <Text style={styles.opacityBadgeText}>{Math.round(opacity * 100)}%</Text>
            </View>
          </View>

          {/* Slider */}
          <View style={styles.sliderRow}>
            <Text style={styles.sliderMinText}>10%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={0.9}
              value={opacity}
              onValueChange={onChangeOpacity}
              minimumTrackTintColor={colors.pixelGreen}
              maximumTrackTintColor={colors.cream}
              thumbTintColor={colors.pixelYellow}
            />
            <Text style={styles.sliderMinText}>90%</Text>
          </View>
        </View>
      )}

      {/* Capture Bar */}
      <View style={styles.shutterBar}>
        {/* Guide Toggle */}
        <Pressable
          style={({ pressed }) => [
            styles.sideActionBtn,
            !showGuide && styles.disabledSideAction,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onToggleGuide();
          }}
          accessibilityLabel="Toggle pose overlay"
        >
          <View style={styles.sideIconBox}>
            {showGuide ? (
              <Eye size={16} color={colors.inkPrimary} strokeWidth={2.5} />
            ) : (
              <EyeOff size={16} color={colors.inkSecondary} strokeWidth={2.5} />
            )}
          </View>
          <Text style={styles.sideActionText}>{showGuide ? 'GUIDE ON' : 'GUIDE OFF'}</Text>
        </Pressable>

        {/* Primary Shutter Button */}
        <Pressable
          style={({ pressed }) => [
            styles.shutterOuter,
            pressed && styles.shutterPressed,
          ]}
          onPress={handleShutterPress}
          disabled={isCapturing}
          accessibilityLabel="Capture photo"
        >
          <View style={[styles.shutterInner, isCapturing && styles.shutterCapturing]} />
        </Pressable>

        {/* Framing Guide Selector */}
        <Pressable
          style={({ pressed }) => [
            styles.sideActionBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            triggerHaptic('selection');
            onCycleFraming();
          }}
          accessibilityLabel="Cycle framing guide"
        >
          <View style={styles.sideIconBox}>
            <Layers size={16} color={colors.inkPrimary} strokeWidth={2.5} />
          </View>
          <Text style={styles.sideActionText}>
            {framingGuide === 'none' ? 'FRAME' : framingGuide.toUpperCase()}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export interface CameraControlsProps extends CameraTopBarProps, CameraBottomDeckProps {}

export const CameraControls: React.FC<CameraControlsProps> = (props) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <CameraTopBar {...props} />
      <View style={{ flex: 1 }} pointerEvents="none" />
      <CameraBottomDeck {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.cream,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    zIndex: 10,
  },
  topCenterWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  topTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.3,
  },
  topSubtitle: {
    fontSize: 8,
    fontFamily: fonts.monoBold,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  activeBtn: {
    backgroundColor: colors.pixelYellow,
  },
  activeGreenBtn: {
    backgroundColor: colors.pixelGreen,
  },
  bottomDeck: {
    backgroundColor: colors.cream,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: colors.borderPrimary,
    zIndex: 10,
  },
  zoomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  zoomPill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    ...shadows.hardXs,
  },
  zoomPillActive: {
    backgroundColor: colors.pixelYellow,
  },
  zoomText: {
    color: colors.inkPrimary,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  zoomTextActive: {
    color: colors.inkPrimary,
  },
  guideControlsCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    padding: 8,
    marginBottom: 10,
    ...shadows.hard,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  modePillActive: {
    backgroundColor: colors.pixelYellow,
  },
  modeText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  modeTextActive: {
    color: colors.inkPrimary,
  },
  opacityBadge: {
    backgroundColor: colors.pixelGreen,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  opacityBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sliderMinText: {
    color: colors.inkSecondary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
  },
  slider: {
    flex: 1,
    height: 28,
    marginHorizontal: 8,
  },
  shutterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sideActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
  },
  sideIconBox: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...shadows.hardXs,
  },
  disabledSideAction: {
    opacity: 0.5,
  },
  sideActionText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 2,
    borderWidth: 3,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pixelYellow,
    ...shadows.hard,
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    backgroundColor: colors.white,
  },
  shutterPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
  shutterCapturing: {
    transform: [{ scale: 0.85 }],
    backgroundColor: colors.pixelOrange,
  },
});
