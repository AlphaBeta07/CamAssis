import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Heart,
  Camera,
  Sun,
  Layers,
  Sparkles,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { colors, fonts, shadows } from '../../theme';
import { fetchPoseById } from '../../services/supabase/api';
import { Pose } from '../../types';
import { usePoseStore } from '../../store/usePoseStore';
import { triggerHaptic } from '../../services/haptics/haptics';

const { width } = Dimensions.get('window');

export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pose, setPose] = useState<Pose | null>(null);

  const { favorites, toggleFavorite, setSelectedPose } = usePoseStore();
  const isFav = pose ? favorites.includes(pose.id) : false;

  useEffect(() => {
    async function load() {
      if (id) {
        const p = await fetchPoseById(id);
        if (p) setPose(p);
      }
    }
    load();
  }, [id]);

  const handleFavorite = () => {
    if (!pose) return;
    triggerHaptic('selection');
    toggleFavorite(pose.id);
  };

  const handleTryPose = () => {
    if (!pose) return;
    triggerHaptic('impactMedium');
    setSelectedPose(pose);
    router.push('/pose/prepare');
  };

  if (!pose) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <StatusBar style="dark" hidden={false} />
        <View style={styles.navHeader}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>LOADING POSE SPECIFICATIONS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable style={styles.roundIconBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {pose.title.toUpperCase()}
          </Text>
        </View>
        <Pressable style={styles.roundIconBtn} onPress={handleFavorite}>
          <Heart
            size={18}
            color={isFav ? colors.pixelOrange : colors.inkPrimary}
            fill={isFav ? colors.pixelOrange : 'transparent'}
            strokeWidth={2.5}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Pose Reference Photograph */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pose.reference_image_url }}
            style={styles.image}
            contentFit="cover"
            priority="high"
          />

          {/* AI Landmark indicator */}
          {pose.has_landmarks && (
            <View style={styles.aiTag}>
              <Sparkles size={11} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.aiTagText}>AI COACH READY • 33 PTS</Text>
            </View>
          )}
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Category & Difficulty */}
          <View style={styles.metaRow}>
            <Badge label={pose.category_name || 'LIFESTYLE'} variant="yellow" />
            <Badge label={pose.difficulty.toUpperCase()} variant="orange" />
            <Badge label={pose.body_framing.toUpperCase()} variant="blue" />
          </View>

          <Text style={styles.title}>{pose.title}</Text>
          <Text style={styles.description}>{pose.description}</Text>

          {/* Camera & Lighting Recommendations */}
          <View style={styles.recommendationCard}>
            <Text style={styles.sectionHeaderTitle}>CAMERA & FRAMING</Text>

            <View style={styles.recomItem}>
              <View style={[styles.recomIconWrap, { backgroundColor: colors.pixelYellow }]}>
                <Camera size={16} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <View style={styles.recomTextCol}>
                <Text style={styles.recomLabel}>CAMERA ANGLE</Text>
                <Text style={styles.recomValue}>{pose.camera_angle.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.recomItem}>
              <View style={[styles.recomIconWrap, { backgroundColor: colors.pixelBlue }]}>
                <Layers size={16} color={colors.white} strokeWidth={2.5} />
              </View>
              <View style={styles.recomTextCol}>
                <Text style={styles.recomLabel}>FRAMING DISTANCE</Text>
                <Text style={styles.recomValue}>{pose.body_framing.toUpperCase()}</Text>
              </View>
            </View>

            {pose.lighting_tips ? (
              <View style={styles.recomItem}>
                <View style={[styles.recomIconWrap, { backgroundColor: colors.pixelOrange }]}>
                  <Sun size={16} color={colors.white} strokeWidth={2.5} />
                </View>
                <View style={styles.recomTextCol}>
                  <Text style={styles.recomLabel}>LIGHTING RECOMMENDATION</Text>
                  <Text style={styles.recomValue}>{pose.lighting_tips}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Step-by-Step Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionHeaderTitle}>STEP-BY-STEP TECHNIQUE</Text>

            {pose.instructions.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{String(idx + 1).padStart(2, '0')}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.stickyBar}>
        <Button
          title="TRY THIS POSE IN CAMERA"
          variant="primary"
          size="lg"
          icon={<Camera size={18} color={colors.inkPrimary} strokeWidth={2.5} />}
          onPress={handleTryPose}
          style={styles.tryButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.cream,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
  },
  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
  },
  navHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkSecondary,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    width,
    height: 380,
    backgroundColor: colors.creamLight,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  floatingNav: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  roundIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  aiTag: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pixelGreen,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  aiTagText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 19,
    marginBottom: 20,
  },
  recommendationCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    marginBottom: 18,
    ...shadows.hard,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  recomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  recomIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  recomTextCol: {
    flex: 1,
  },
  recomLabel: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkSecondary,
    letterSpacing: 0.5,
  },
  recomValue: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginTop: 2,
  },
  instructionsSection: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    ...shadows.hard,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  stepNumberText: {
    color: colors.inkPrimary,
    fontSize: 10,
    fontFamily: fonts.monoBold,
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkPrimary,
    lineHeight: 18,
  },
  stickyBar: {
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
  tryButton: {
    width: '100%',
  },
});
