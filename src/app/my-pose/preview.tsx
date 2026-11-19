import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Camera,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Button } from '../../components/common/Button';
import { SkeletonOverlay } from '../../components/camera/SkeletonOverlay';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { detectPoseFromImage } from '../../ai/user-pose-detector';
import { useCustomPoseStore, customPoseToStandardPose } from '../../store/useCustomPoseStore';
import { usePoseStore } from '../../store/usePoseStore';
import { pickPoseImage } from '../../services/image-picker/picker';
import { Landmark, BodyFraming } from '../../types';
import { triggerHaptic } from '../../services/haptics/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_HEIGHT = 400;

type PreviewMode = 'photo' | 'outline' | 'skeleton' | 'combined';

export default function MyPosePreviewScreen() {
  const { imageUri, imageWidth, imageHeight } = useLocalSearchParams<{
    imageUri: string;
    imageWidth?: string;
    imageHeight?: string;
  }>();

  const [currentUri, setCurrentUri] = useState<string>(imageUri || '');
  const [loading, setLoading] = useState<boolean>(true);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [framing, setFraming] = useState<BodyFraming>('Full-Body');
  const [confidence, setConfidence] = useState<number>(92);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('combined');
  const [opacity, setOpacity] = useState<number>(0.55);
  const [poseTitle, setPoseTitle] = useState<string>('My Custom Pose');

  const { addCustomPose } = useCustomPoseStore();
  const { setSelectedPose } = usePoseStore();

  const analyzePhoto = async (uri: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await detectPoseFromImage(
        uri,
        Number(imageWidth) || 800,
        Number(imageHeight) || 1000
      );

      if (res.success && res.landmarks) {
        setLandmarks(res.landmarks);
        if (res.bodyFraming) setFraming(res.bodyFraming);
        if (res.confidence) setConfidence(res.confidence);
      } else {
        setErrorMsg(res.error || "Couldn't detect a clear pose. Try another photo.");
      }
    } catch {
      setErrorMsg("Couldn't detect a clear pose. Try another photo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageUri) {
      analyzePhoto(imageUri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUri]);

  const handlePickAnother = async () => {
    triggerHaptic('impactLight');
    const result = await pickPoseImage();
    if (!result.canceled && result.uri) {
      setCurrentUri(result.uri);
      analyzePhoto(result.uri);
    }
  };

  const handleUsePose = async () => {
    if (!currentUri || landmarks.length === 0) return;

    triggerHaptic('impactHeavy');

    const customPose = {
      id: `custom-pose-${Date.now()}`,
      title: poseTitle.trim() || 'My Custom Pose',
      imageUri: currentUri,
      landmarks,
      bodyFraming: framing,
      confidence,
      createdAt: new Date().toISOString(),
      cameraAngle: 'Eye Level' as const,
    };

    // Save locally
    await addCustomPose(customPose);

    // Convert and set active in pose store
    const standardPose = customPoseToStandardPose(customPose);
    setSelectedPose(standardPose);

    // Launch Ghost Pose Camera immediately
    router.replace('/camera');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.pressed,
            ]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>POSE GUIDE PREVIEW</Text>
            <Text style={styles.headerSubtitle}>CALIBRATION & SKELETON MAP</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.pixelYellow} />
              <Text style={styles.loadingTitle}>DETECTING SKELETON...</Text>
              <Text style={styles.loadingSubtitle}>
                Extracting 33 on-device landmarks and generating skeletal outline.
              </Text>
            </View>
          ) : errorMsg ? (
            /* Error State */
            <View style={styles.errorBox}>
              <View style={styles.errorIconWrap}>
                <AlertCircle size={28} color={colors.white} strokeWidth={2.5} />
              </View>
              <Text style={styles.errorTitle}>NO CLEAR POSE DETECTED</Text>
              <Text style={styles.errorDesc}>{errorMsg}</Text>
              <Button
                title="CHOOSE ANOTHER PHOTO"
                variant="primary"
                icon={<RefreshCw size={15} color={colors.inkPrimary} strokeWidth={2.5} />}
                onPress={handlePickAnother}
                style={styles.retryBtn}
              />
            </View>
          ) : (
            /* Success Detection Preview */
            <View>
              {/* Viewport Frame */}
              <View style={styles.viewport}>
                {/* Layer 1: Photo */}
                {(previewMode === 'photo' || previewMode === 'combined') && (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      { opacity: previewMode === 'combined' ? opacity : 1 },
                    ]}
                  >
                    <Image source={{ uri: currentUri }} style={styles.previewImg} contentFit="cover" />
                  </View>
                )}

                {/* Layer 2: Skeleton / Outline */}
                {(previewMode === 'outline' || previewMode === 'skeleton' || previewMode === 'combined') && (
                  <SkeletonOverlay
                    landmarks={landmarks}
                    width={SCREEN_WIDTH - 32}
                    height={PREVIEW_HEIGHT}
                    isGhostReference={true}
                    opacity={previewMode === 'skeleton' ? 1 : 0.9}
                  />
                )}

                {/* Floating Quality Pill */}
                <View style={styles.qualityPill}>
                  <CheckCircle2 size={13} color={colors.pixelGreen} strokeWidth={2.5} />
                  <Text style={styles.qualityText}>33 PTS • {confidence}% CONFIDENCE</Text>
                </View>
              </View>

              {/* View Mode Pills */}
              <View style={styles.modesRow}>
                {[
                  { id: 'combined', label: 'COMBINED' },
                  { id: 'photo', label: 'PHOTO' },
                  { id: 'outline', label: 'OUTLINE' },
                  { id: 'skeleton', label: 'SKELETON' },
                ].map((m) => (
                  <Pressable
                    key={m.id}
                    style={({ pressed }) => [
                      styles.modePill,
                      previewMode === m.id && styles.modePillActive,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => {
                      triggerHaptic('selection');
                      setPreviewMode(m.id as PreviewMode);
                    }}
                  >
                    <Text
                      style={[
                        styles.modePillText,
                        previewMode === m.id && styles.modePillTextActive,
                      ]}
                    >
                      {m.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Transparency Slider */}
              {(previewMode === 'combined' || previewMode === 'photo') && (
                <View style={styles.sliderCard}>
                  <View style={styles.sliderHeader}>
                    <Text style={styles.sliderLabel}>OVERLAY OPACITY</Text>
                    <Text style={styles.sliderValue}>{Math.round(opacity * 100)}%</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0.1}
                    maximumValue={0.9}
                    value={opacity}
                    onValueChange={setOpacity}
                    minimumTrackTintColor={colors.pixelGreen}
                    maximumTrackTintColor={colors.cream}
                    thumbTintColor={colors.pixelYellow}
                  />
                </View>
              )}

              {/* Pose Title Configuration */}
              <View style={styles.configCard}>
                <Text style={styles.configLabel}>POSE GUIDE TITLE</Text>
                <TextInput
                  style={styles.titleInput}
                  value={poseTitle}
                  onChangeText={setPoseTitle}
                  placeholder="GIVE YOUR POSE A NAME..."
                  placeholderTextColor={colors.inkSecondary}
                />

                <View style={styles.statsRow}>
                  <View style={styles.statChip}>
                    <Text style={styles.statChipLabel}>FRAMING</Text>
                    <Text style={styles.statChipValue}>{framing.toUpperCase()}</Text>
                  </View>

                  <View style={styles.statChip}>
                    <Text style={styles.statChipLabel}>CAMERA</Text>
                    <Text style={styles.statChipValue}>EYE LEVEL</Text>
                  </View>

                  <View style={styles.statChip}>
                    <Text style={styles.statChipLabel}>AI COACH</Text>
                    <Text style={styles.statChipValue}>ACTIVE</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Sticky Bottom Actions */}
        {!loading && !errorMsg && (
          <View style={styles.footerBar}>
            <Button
              title="USE THIS POSE IN CAMERA"
              variant="primary"
              size="lg"
              icon={<Camera size={18} color={colors.inkPrimary} strokeWidth={2.5} />}
              onPress={handleUsePose}
              style={styles.usePoseBtn}
            />
          </View>
        )}
      </DottedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: colors.cream,
  },
  backBtn: {
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 9,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  loadingBox: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  loadingTitle: {
    fontSize: 15,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginTop: 16,
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  errorBox: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.error,
    ...shadows.hard,
  },
  errorIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 2,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...shadows.hardXs,
  },
  errorTitle: {
    fontSize: 13,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 8,
  },
  errorDesc: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  retryBtn: {
    minWidth: 200,
  },
  viewport: {
    width: '100%',
    height: PREVIEW_HEIGHT,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#1E1B18',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 14,
    ...shadows.hard,
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  qualityPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    ...shadows.hardXs,
  },
  qualityText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  modesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  modePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    ...shadows.hardXs,
  },
  modePillActive: {
    backgroundColor: colors.pixelYellow,
  },
  modePillText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.3,
  },
  modePillTextActive: {
    color: colors.inkPrimary,
  },
  sliderCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 12,
    ...shadows.hard,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  sliderValue: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.pixelGreen,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  configCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 16,
    ...shadows.hard,
  },
  configLabel: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  titleInput: {
    backgroundColor: colors.creamLight,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statChipLabel: {
    fontSize: 8,
    color: colors.inkSecondary,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statChipValue: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 2,
    borderTopColor: colors.borderPrimary,
  },
  usePoseBtn: {
    width: '100%',
  },
});
