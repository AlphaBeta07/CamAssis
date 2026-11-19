import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { ArrowLeft, Camera, Layers, RotateCcw, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { usePoseStore } from '../../store/usePoseStore';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function PosePrepareScreen() {
  const { selectedPose } = usePoseStore();

  if (!selectedPose) {
    router.replace('/(tabs)/explore');
    return null;
  }

  const handleOpenCamera = () => {
    triggerHaptic('impactHeavy');
    router.push('/camera');
  };

  const handleChangePose = () => {
    triggerHaptic('selection');
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>PREPARE SHOT</Text>
            <Text style={styles.headerSubtitle}>CHECKLIST & CAMERA GUIDE</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Preview Card */}
          <View style={styles.previewCard}>
            <Image
              source={{ uri: selectedPose.reference_image_url }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <View style={styles.previewOverlay} />
            <View style={styles.previewContent}>
              <View style={styles.aiTag}>
                <Sparkles size={11} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.aiTagText}>GHOST CAMERA READY</Text>
              </View>
              <Text style={styles.poseTitle}>{selectedPose.title}</Text>
              <Text style={styles.categoryBadge}>
                {selectedPose.category_name?.toUpperCase() || 'LIFESTYLE'} • {selectedPose.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Framing & Position Checklist */}
          <View style={styles.checklistCard}>
            <Text style={styles.sectionTitle}>SETUP SPECIFICATIONS</Text>

            <View style={styles.checkItem}>
              <View style={[styles.checkIcon, { backgroundColor: colors.pixelYellow }]}>
                <Camera size={16} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <View style={styles.checkTextCol}>
                <Text style={styles.checkLabel}>CAMERA ANGLE</Text>
                <Text style={styles.checkValue}>{selectedPose.camera_angle.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.checkItem}>
              <View style={[styles.checkIcon, { backgroundColor: colors.pixelBlue }]}>
                <Layers size={16} color={colors.white} strokeWidth={2.5} />
              </View>
              <View style={styles.checkTextCol}>
                <Text style={styles.checkLabel}>FRAMING DISTANCE</Text>
                <Text style={styles.checkValue}>{selectedPose.body_framing.toUpperCase()} FRAMING</Text>
              </View>
            </View>
          </View>

          {/* Pose Instructions Recap */}
          <View style={styles.instructionsCard}>
            <Text style={styles.sectionTitle}>KEY TECHNIQUE POINTS</Text>
            {selectedPose.instructions.map((ins, i) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.bulletDot}>
                  <Text style={styles.bulletText}>{i + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{ins}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Footer */}
        <View style={styles.footerBar}>
          <Button
            title="OPEN GHOST CAMERA"
            variant="primary"
            size="lg"
            icon={<Camera size={18} color={colors.inkPrimary} strokeWidth={2.5} />}
            onPress={handleOpenCamera}
            style={styles.openBtn}
          />

          <Button
            title="CHOOSE DIFFERENT POSE"
            variant="outline"
            size="md"
            icon={<RotateCcw size={15} color={colors.inkPrimary} strokeWidth={2.5} />}
            onPress={handleChangePose}
            style={styles.changeBtn}
          />
        </View>
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
    paddingBottom: 150,
  },
  previewCard: {
    height: 230,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: colors.white,
    ...shadows.hard,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 37, 29, 0.65)',
  },
  previewContent: {
    ...StyleSheet.absoluteFill,
    padding: 16,
    justifyContent: 'flex-end',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pixelGreen,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
    ...shadows.hardXs,
  },
  aiTagText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  poseTitle: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.pixel,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  categoryBadge: {
    color: colors.pixelYellow,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  checklistCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    padding: 16,
    marginBottom: 16,
    ...shadows.hard,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkIcon: {
    width: 34,
    height: 34,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  checkTextCol: {
    flex: 1,
  },
  checkLabel: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkSecondary,
    letterSpacing: 0.5,
  },
  checkValue: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginTop: 2,
  },
  instructionsCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    padding: 16,
    ...shadows.hard,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bulletDot: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  bulletText: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkPrimary,
    lineHeight: 18,
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
    gap: 8,
  },
  openBtn: {
    width: '100%',
  },
  changeBtn: {
    width: '100%',
  },
});
