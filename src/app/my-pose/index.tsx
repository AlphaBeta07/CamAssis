import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Trash2,
  Edit2,
  Plus,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { useCustomPoseStore, customPoseToStandardPose } from '../../store/useCustomPoseStore';
import { usePoseStore } from '../../store/usePoseStore';
import { pickPoseImage } from '../../services/image-picker/picker';
import { triggerHaptic } from '../../services/haptics/haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export default function MyPoseScreen() {
  const { customPoses, loadCustomPoses, deleteCustomPose, renameCustomPose } = useCustomPoseStore();
  const { setSelectedPose } = usePoseStore();
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    loadCustomPoses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePickPhoto = async () => {
    if (picking) return;
    setPicking(true);
    triggerHaptic('impactMedium');

    const result = await pickPoseImage();
    setPicking(false);

    if (!result.canceled && result.uri) {
      router.push({
        pathname: '/my-pose/preview',
        params: {
          imageUri: result.uri,
          imageWidth: result.width || 800,
          imageHeight: result.height || 1000,
        },
      });
    }
  };

  const handleUseCustomPose = (customPose: any) => {
    triggerHaptic('impactHeavy');
    const standardPose = customPoseToStandardPose(customPose);
    setSelectedPose(standardPose);
    router.push('/camera');
  };

  const handleDeletePose = (id: string, title: string) => {
    triggerHaptic('selection');
    Alert.alert('Delete Pose Guide', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCustomPose(id);
          triggerHaptic('success');
        },
      },
    ]);
  };

  const handleRenamePose = (id: string, currentTitle: string) => {
    triggerHaptic('selection');
    Alert.prompt(
      'Rename Pose Guide',
      'Enter a new name for this pose guide:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (newText?: string) => {
            if (newText && newText.trim()) {
              renameCustomPose(id, newText.trim());
              triggerHaptic('success');
            }
          },
        },
      ],
      'plain-text',
      currentTitle
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        {/* Top Header */}
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
            <Text style={styles.headerTitle}>MY POSE</Text>
            <Text style={styles.headerSubtitle}>CUSTOM POSE GENERATOR</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.badgeBox}>
                <Sparkles size={11} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.badgeText}>CORE AI TOOL</Text>
              </View>
              <Text style={styles.heroStep}>0-CLOUD • ON-DEVICE</Text>
            </View>

            <Text style={styles.heroTitle}>TURN ANY PHOTO INTO A CAMERA GUIDE</Text>
            <Text style={styles.heroSubtitle}>
              Select any photo from your gallery. CamAssis extracts 33 body landmarks and generates a transparent viewfinder guide.
            </Text>

            <Button
              title="CHOOSE A POSE PHOTO"
              variant="primary"
              size="lg"
              icon={<Plus size={16} color={colors.inkPrimary} strokeWidth={2.5} />}
              onPress={handlePickPhoto}
              loading={picking}
              style={styles.heroCta}
            />
          </View>

          {/* How It Works Section */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={[styles.stepIconBox, { backgroundColor: colors.pixelYellow }]}>
                <ImageIcon size={18} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>01. YOUR PHOTO</Text>
                <Text style={styles.stepDesc}>
                  Select a photograph containing the aesthetic pose you want to recreate.
                </Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={[styles.stepIconBox, { backgroundColor: colors.pixelBlue }]}>
                <Sparkles size={18} color={colors.white} strokeWidth={2.5} />
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>02. POSE SKELETON</Text>
                <Text style={styles.stepDesc}>
                  On-device AI extracts 33 body landmarks and creates an outline skeleton.
                </Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={[styles.stepIconBox, { backgroundColor: colors.pixelGreen }]}>
                <Camera size={18} color={colors.white} strokeWidth={2.5} />
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>03. CAMERA GUIDE</Text>
                <Text style={styles.stepDesc}>
                  Position your subject directly inside the transparent guide with live matching.
                </Text>
              </View>
            </View>
          </View>

          {/* Saved Guides Section */}
          <View style={styles.savedSectionHeader}>
            <Text style={styles.sectionTitle}>SAVED POSE GUIDES</Text>
            <Text style={styles.savedCountText}>{customPoses.length} SAVED</Text>
          </View>

          {customPoses.length === 0 ? (
            <EmptyState
              icon={<Layers size={24} color={colors.inkPrimary} strokeWidth={2.5} />}
              title="NO CUSTOM GUIDES YET"
              description="Tap 'CHOOSE A POSE PHOTO' above to convert your favorite picture into a camera guide."
              actionTitle="CREATE POSE GUIDE"
              onAction={handlePickPhoto}
            />
          ) : (
            <View style={styles.guidesGrid}>
              {customPoses.map((item) => (
                <View key={item.id} style={styles.guideCard}>
                  <View style={styles.guideImageContainer}>
                    <Image source={{ uri: item.imageUri }} style={styles.guideImage} contentFit="cover" />

                    {/* Actions Overlay */}
                    <View style={styles.cardActionsTop}>
                      <Pressable
                        style={styles.cardMiniBtn}
                        onPress={() => handleRenamePose(item.id, item.title)}
                      >
                        <Edit2 size={12} color={colors.inkPrimary} strokeWidth={2} />
                      </Pressable>
                      <Pressable
                        style={[styles.cardMiniBtn, { backgroundColor: colors.error }]}
                        onPress={() => handleDeletePose(item.id, item.title)}
                      >
                        <Trash2 size={12} color={colors.white} strokeWidth={2} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.guideCardDetails}>
                    <Text style={styles.guideCardTitle} numberOfLines={1}>
                      {item.title.toUpperCase()}
                    </Text>
                    <Text style={styles.guideCardDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.useGuideBtn,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => handleUseCustomPose(item)}
                    >
                      <Camera size={13} color={colors.inkPrimary} strokeWidth={2.5} />
                      <Text style={styles.useGuideText}>USE POSE</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
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
    fontSize: 16,
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
    paddingBottom: 40,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  heroCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    marginBottom: 20,
    ...shadows.hard,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pixelOrange,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  heroStep: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 15,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCta: {
    width: '100%',
  },
  sectionTitleRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  stepsContainer: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 14,
    marginBottom: 20,
    ...shadows.hard,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIconBox: {
    width: 38,
    height: 38,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 16,
  },
  stepDivider: {
    height: 1.5,
    backgroundColor: colors.borderPrimary,
    marginVertical: 12,
  },
  savedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  savedCountText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.pixelOrange,
  },
  guidesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  guideCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  guideImageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
    backgroundColor: colors.creamLight,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderPrimary,
  },
  guideImage: {
    width: '100%',
    height: '100%',
  },
  cardActionsTop: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    gap: 4,
  },
  cardMiniBtn: {
    width: 26,
    height: 26,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  guideCardDetails: {
    padding: 10,
  },
  guideCardTitle: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 2,
  },
  guideCardDate: {
    fontSize: 9,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    marginBottom: 8,
  },
  useGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 7,
    ...shadows.hardXs,
  },
  useGuideText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
});
