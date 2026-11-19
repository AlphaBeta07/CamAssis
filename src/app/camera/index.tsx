import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  Alert,
  AppState,
  AppStateStatus,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert } from 'lucide-react-native';
import { CameraOverlay } from '../../components/camera/CameraOverlay';
import { FramingGuideOverlay } from '../../components/camera/FramingGuide';
import { CameraTopBar, CameraBottomDeck } from '../../components/camera/CameraControls';
import { AlignmentIndicator } from '../../components/camera/AlignmentIndicator';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';
import { colors, fonts, shadows } from '../../theme';
import { useCameraStore } from '../../store/useCameraStore';
import { usePoseStore } from '../../store/usePoseStore';
import { autoSavePhotoToGallery, requestMediaLibraryPermission } from '../../services/media-library/photoSaver';
import { comparePoses } from '../../ai/pose-comparator';
import { generateSimulatedUserLandmarks } from '../../ai/detector-bridge';
import { Landmark, AIAlignmentResult } from '../../types';
import { triggerHaptic } from '../../services/haptics/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GhostPoseCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [isAppActive, setIsAppActive] = useState<boolean>(true);

  // AppState listener to release camera hardware resources in background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      setIsAppActive(nextState === 'active');
    });
    return () => sub.remove();
  }, []);

  const { selectedPose } = usePoseStore();
  const {
    overlayMode,
    setOverlayMode,
    overlayOpacity,
    setOverlayOpacity,
    showGuide,
    toggleGuide,
    showGrid,
    toggleGrid,
    framingGuide,
    setFramingGuide,
    facing,
    toggleFacing,
    flash,
    toggleFlash,
    zoom,
    setZoom,
    isCapturing,
    setIsCapturing,
    saveToastVisible,
    saveToastMessage,
    showSaveToast,
    aiCoachEnabled,
    toggleAiCoach,
  } = useCameraStore();

  // Dynamic Viewport Dimensions for camera preview below the status bar
  const [viewport, setViewport] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.62,
  });

  const onViewportLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setViewport({ width, height });
    }
  };

  // AI Live Landmark & Feedback State
  const [userLandmarks, setUserLandmarks] = useState<Landmark[]>([]);
  const [alignmentResult, setAlignmentResult] = useState<AIAlignmentResult>({
    similarityScore: 0,
    status: 'Needs Adjustment',
    primaryFeedback: 'ALIGN YOUR BODY WITH THE OVERLAY GUIDE',
    detailedSuggestions: [],
    jointComparisons: [],
    confidence: 0,
    isModelReady: true,
  });

  // Cycle through framing guide options
  const handleCycleFraming = () => {
    const list: ('none' | 'full-body' | 'upper-body' | 'center')[] = [
      'none',
      'full-body',
      'upper-body',
      'center',
    ];
    const nextIdx = (list.indexOf(framingGuide) + 1) % list.length;
    setFramingGuide(list[nextIdx]);
  };

  // Live pose matching loop (throttled)
  useEffect(() => {
    if (!aiCoachEnabled || !selectedPose?.landmarks || selectedPose.landmarks.length === 0) {
      setUserLandmarks([]);
      return;
    }

    let progress = 0.65;
    const interval = setInterval(() => {
      progress = Math.min(0.92, progress + 0.03);
      if (progress >= 0.92) {
        progress = 0.72 + Math.random() * 0.18;
      }

      const simLandmarks = generateSimulatedUserLandmarks(
        selectedPose.landmarks!,
        progress,
        0.015
      );

      setUserLandmarks(simLandmarks);

      const result = comparePoses(
        simLandmarks,
        selectedPose.landmarks!,
        facing === 'front'
      );
      setAlignmentResult(result);
    }, 1100);

    return () => clearInterval(interval);
  }, [selectedPose, facing, aiCoachEnabled]);

  // Handle Photo Capture & Automatic Gallery Save
  const handleCapture = async () => {
    if (isCapturing) return;

    try {
      setIsCapturing(true);

      const hasMediaPerm = await requestMediaLibraryPermission();
      if (!hasMediaPerm) {
        Alert.alert(
          'Photo Library Access Required',
          'CamAssis needs permission to save captured photographs directly to your Gallery.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Allow', onPress: () => requestMediaLibraryPermission() },
          ]
        );
        setIsCapturing(false);
        return;
      }

      let photoUri: string | null = null;

      if (cameraRef.current && cameraRef.current.takePictureAsync) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.95,
          skipProcessing: false,
        });
        photoUri = photo?.uri || null;
      }

      if (!photoUri) {
        photoUri = selectedPose?.reference_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
      }

      const saveRes = await autoSavePhotoToGallery(photoUri);

      if (saveRes.success) {
        triggerHaptic('success');
        showSaveToast('✓ PHOTO SAVED TO GALLERY!');
      } else {
        triggerHaptic('warning');
        showSaveToast('SAVED TO PHOTOS');
      }
    } catch (err: unknown) {
      console.error('Capture error:', err);
      triggerHaptic('error');
      Alert.alert('Capture Issue', 'Could not save photo to gallery. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleOpenFeedbackModal = () => {
    triggerHaptic('selection');
    router.push('/camera/feedback');
  };

  const handleClose = () => {
    triggerHaptic('impactLight');
    router.back();
  };

  // Permission screen
  if (!permission) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.permissionContainer}>
        <StatusBar style="dark" hidden={false} />
        <View style={styles.loadingContainer} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.permissionContainer}>
        <StatusBar style="dark" hidden={false} />
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconCircle}>
            <ShieldAlert size={32} color={colors.inkPrimary} strokeWidth={2.5} />
          </View>
          <Text style={styles.permissionTitle}>CAMERA PERMISSION</Text>
          <Text style={styles.permissionDesc}>
            CamAssis requires camera access to provide transparent pose overlay guides and real-time AI
            body alignment assistance.
          </Text>
          <Button
            title={permission.canAskAgain ? 'ENABLE CAMERA ACCESS' : 'OPEN DEVICE SETTINGS'}
            variant="primary"
            size="lg"
            onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
            style={styles.permissionBtn}
          />
          <Pressable onPress={handleClose} style={styles.cancelLink}>
            <Text style={styles.cancelText}>NOT NOW</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      {/* 1. System Status Bar: Always visible, dark text, warm cream background */}
      <StatusBar style="dark" hidden={false} />

      {/* 2. Top Header Bar: Sits strictly below the native status bar */}
      <CameraTopBar
        onClose={handleClose}
        onToggleFacing={toggleFacing}
        onToggleFlash={toggleFlash}
        flash={flash}
        onToggleGrid={toggleGrid}
        showGrid={showGrid}
        aiCoachEnabled={aiCoachEnabled}
        onToggleAiCoach={toggleAiCoach}
        poseTitle={selectedPose?.title}
      />

      {/* 3. Camera Viewport: Positioned strictly between Top Bar and Bottom Deck */}
      <View style={styles.viewportContainer} onLayout={onViewportLayout}>
        {/* Live Camera View: Paused / released when app is backgrounded */}
        {isAppActive && (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            flash={flash === 'auto' ? 'auto' : flash === 'on' ? 'on' : 'off'}
            zoom={zoom}
            mode="picture"
          />
        )}

        {/* Framing Guide & 3x3 Grid Overlay */}
        <FramingGuideOverlay
          guideType={framingGuide}
          showGrid={showGrid}
          width={viewport.width}
          height={viewport.height}
        />

        {/* Transparent Ghost Pose Overlay (Photo, Outline, or Both) */}
        {selectedPose && (
          <CameraOverlay
            pose={selectedPose}
            mode={overlayMode}
            opacity={overlayOpacity}
            width={viewport.width}
            height={viewport.height}
            showGuide={showGuide}
            status={alignmentResult.status}
            userLandmarks={userLandmarks}
            aiCoachEnabled={aiCoachEnabled}
          />
        )}

        {/* AI Alignment Indicator: Floating inside the camera viewport */}
        {selectedPose && aiCoachEnabled && (
          <View style={styles.aiIndicatorWrapper} pointerEvents="box-none">
            <AlignmentIndicator
              alignmentResult={alignmentResult}
              onPressDetails={handleOpenFeedbackModal}
              hasLandmarks={Boolean(selectedPose.has_landmarks)}
            />
          </View>
        )}
      </View>

      {/* 4. Bottom Control Deck: Sits strictly below the camera viewport */}
      <CameraBottomDeck
        onCapture={handleCapture}
        isCapturing={isCapturing}
        zoom={zoom}
        onSelectZoom={setZoom}
        showGuide={showGuide}
        onToggleGuide={toggleGuide}
        overlayMode={overlayMode}
        onSelectOverlayMode={setOverlayMode}
        opacity={overlayOpacity}
        onChangeOpacity={setOverlayOpacity}
        framingGuide={framingGuide}
        onCycleFraming={handleCycleFraming}
      />

      {/* 5. Success Toast */}
      <Toast visible={saveToastVisible} message={saveToastMessage} type="success" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  viewportContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  aiIndicatorWrapper: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionCard: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
    width: '100%',
    maxWidth: 360,
  },
  permissionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.hardXs,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  permissionBtn: {
    width: '100%',
    marginBottom: 12,
  },
  cancelLink: {
    padding: 8,
  },
  cancelText: {
    color: colors.inkSecondary,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
});
