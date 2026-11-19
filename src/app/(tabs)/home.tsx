import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Flame, Calendar, ArrowRight, Camera, Sparkles } from 'lucide-react-native';
import { Header } from '../../components/common/Header';
import { CategoryCard } from '../../components/pose/CategoryCard';
import { PoseCard } from '../../components/pose/PoseCard';
import { DottedBackground } from '../../components/common/DottedBackground';
import { PixelArtIllustration } from '../../components/common/PixelArtIllustration';
import { colors, fonts, shadows } from '../../theme';
import { usePoseStore } from '../../store/usePoseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchCategories, fetchPoses, fetchPoseOfTheDay } from '../../services/supabase/api';
import { Category, Pose } from '../../types';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingPoses, setTrendingPoses] = useState<Pose[]>([]);
  const [poseOfTheDay, setPoseOfTheDay] = useState<Pose | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();
  const { loadFavorites, setSelectedPose } = usePoseStore();

  const loadData = async () => {
    try {
      const [cats, poses, potd] = await Promise.all([
        fetchCategories(),
        fetchPoses({ difficulty: undefined }),
        fetchPoseOfTheDay(),
      ]);
      setCategories(cats);
      setTrendingPoses(poses.slice(0, 5));
      setPoseOfTheDay(potd);
      await loadFavorites(user?.id);
    } catch (e) {
      console.warn('Failed to load home data:', e);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <Header />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.pixelYellow}
              colors={[colors.pixelYellow, colors.pixelGreen]}
            />
          }
        >
          {/* Search Bar Input Trigger */}
          <Pressable
            style={({ pressed }) => [
              styles.searchBar,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push('/search')}
          >
            <Search size={18} color={colors.inkPrimary} strokeWidth={2.5} />
            <Text style={styles.searchText}>SEARCH POSES, STYLES, CATEGORIES...</Text>
          </Pressable>

          {/* Retro Hero Banner */}
          <View style={styles.heroBox}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Sparkles size={11} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.heroBadgeText}>AI CAMERA ASSISTANT</Text>
              </View>
              <Text style={styles.heroTag}>VER 2.0</Text>
            </View>

            <View style={styles.heroContentRow}>
              <View style={styles.heroTextCol}>
                <Text style={styles.heroTitle}>POSE IT.{"\n"}CAPTURE IT.</Text>
                <Text style={styles.heroSubtitle}>
                  Transparent pose guides & real-time on-device AI alignment.
                </Text>
              </View>
              <View style={styles.heroIllustrationWrap}>
                <PixelArtIllustration type="hero-camera" size={105} />
              </View>
            </View>

            <View style={styles.heroActionsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryCta,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  triggerHaptic('impactLight');
                  router.push('/(tabs)/explore');
                }}
              >
                <Text style={styles.primaryCtaText}>EXPLORE POSES</Text>
                <ArrowRight size={14} color={colors.inkPrimary} strokeWidth={2.5} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryCta,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  triggerHaptic('impactLight');
                  router.push('/my-pose');
                }}
              >
                <Text style={styles.secondaryCtaText}>MY POSE</Text>
              </Pressable>
            </View>
          </View>

          {/* Categories Bar */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CATEGORIES</Text>
            <Pressable
              style={({ pressed }) => [
                styles.seeAllBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.seeAllText}>ALL (12)</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat, idx) => (
              <CategoryCard key={cat.id} category={cat} colorIndex={idx} />
            ))}
          </ScrollView>

          {/* My Pose Feature Card */}
          <Pressable
            style={({ pressed }) => [
              styles.myPoseCard,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              triggerHaptic('impactLight');
              router.push('/my-pose');
            }}
          >
            <View style={styles.myPoseHeader}>
              <View style={styles.myPoseBadge}>
                <Text style={styles.myPoseBadgeText}>NEW FEATURE</Text>
              </View>
              <Text style={styles.myPoseStep}>01 PHOTO → 02 GUIDE</Text>
            </View>

            <View style={styles.myPoseBody}>
              <View style={styles.myPoseTextCol}>
                <Text style={styles.myPoseTitle}>CREATE YOUR OWN POSE GUIDE</Text>
                <Text style={styles.myPoseDesc}>
                  Select any photo from your gallery. CamAssis extracts body landmarks and creates a transparent camera guide.
                </Text>
                <View style={styles.myPoseBtn}>
                  <Text style={styles.myPoseBtnText}>OPEN MY POSE</Text>
                  <ArrowRight size={14} color={colors.inkPrimary} strokeWidth={2.5} />
                </View>
              </View>
              <View style={styles.myPoseArtWrap}>
                <PixelArtIllustration type="pose-guide" size={88} />
              </View>
            </View>
          </Pressable>

          {/* Pose of the Day */}
          {poseOfTheDay && (
            <View style={styles.potdSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleWithIcon}>
                  <Calendar size={16} color={colors.pixelGreen} strokeWidth={2.5} />
                  <Text style={styles.sectionTitle}>POSE OF THE DAY</Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.potdCard,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  triggerHaptic('impactLight');
                  setSelectedPose(poseOfTheDay);
                  router.push({
                    pathname: '/pose/[id]',
                    params: { id: poseOfTheDay.id },
                  });
                }}
              >
                <Image
                  source={{ uri: poseOfTheDay.reference_image_url }}
                  style={styles.potdImage}
                  contentFit="cover"
                />
                <View style={styles.potdOverlay} />
                <View style={styles.potdContent}>
                  <View style={styles.potdBadgeRow}>
                    <Text style={styles.potdCategory}>{poseOfTheDay.category_name || 'FEATURED'}</Text>
                    <Text style={styles.potdFraming}>• {poseOfTheDay.body_framing.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.potdTitle}>{poseOfTheDay.title}</Text>
                  <Text style={styles.potdDesc} numberOfLines={2}>
                    {poseOfTheDay.description}
                  </Text>
                  <Pressable
                    style={({ pressed: btnPressed }) => [
                      styles.potdTryBtn,
                      btnPressed && styles.pressed,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      triggerHaptic('impactMedium');
                      setSelectedPose(poseOfTheDay);
                      router.push('/pose/prepare');
                    }}
                  >
                    <Camera size={14} color={colors.inkPrimary} strokeWidth={2.5} />
                    <Text style={styles.potdTryText}>TRY TODAY'S POSE</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          )}

          {/* Trending Poses Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <Flame size={16} color={colors.pixelOrange} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>TRENDING POSES</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.seeAllBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.seeAllText}>MORE</Text>
            </Pressable>
          </View>

          <View style={styles.trendingList}>
            {trendingPoses.map((pose) => (
              <PoseCard key={pose.id} pose={pose} layout="full" />
            ))}
          </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    ...shadows.hard,
  },
  searchText: {
    fontSize: 11,
    fontFamily: fonts.monoMedium,
    color: colors.inkSecondary,
    letterSpacing: 0.5,
  },
  heroBox: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    marginBottom: 20,
    ...shadows.hard,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.pixelGreen,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  heroTag: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.pixelOrange,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    lineHeight: 26,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 18,
  },
  heroIllustrationWrap: {
    width: 105,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryCta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 12,
    ...shadows.hardSm,
  },
  primaryCtaText: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  secondaryCta: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pixelBlue,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 12,
    ...shadows.hardSm,
  },
  secondaryCtaText: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  seeAllBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  seeAllText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  categoryScroll: {
    paddingBottom: 8,
    marginBottom: 16,
  },
  myPoseCard: {
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    marginBottom: 20,
    ...shadows.hard,
  },
  myPoseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  myPoseBadge: {
    backgroundColor: colors.borderPrimary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  myPoseBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  myPoseStep: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  myPoseBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myPoseTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  myPoseTitle: {
    fontSize: 13,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  myPoseDesc: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkPrimary,
    lineHeight: 16,
    marginBottom: 12,
  },
  myPoseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    ...shadows.hardXs,
  },
  myPoseBtnText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  myPoseArtWrap: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  potdSection: {
    marginBottom: 20,
  },
  potdCard: {
    width: '100%',
    height: 220,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.white,
    ...shadows.hard,
  },
  potdImage: {
    width: '100%',
    height: '100%',
  },
  potdOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 37, 29, 0.65)',
  },
  potdContent: {
    ...StyleSheet.absoluteFill,
    padding: 16,
    justifyContent: 'flex-end',
  },
  potdBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  potdCategory: {
    color: colors.pixelYellow,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  potdFraming: {
    color: colors.creamLight,
    fontSize: 10,
    fontFamily: fonts.mono,
    marginLeft: 4,
  },
  potdTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.pixel,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  potdDesc: {
    color: colors.creamLight,
    fontSize: 11,
    fontFamily: fonts.mono,
    lineHeight: 16,
    marginBottom: 12,
  },
  potdTryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 8,
    borderRadius: 2,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    ...shadows.hardXs,
  },
  potdTryText: {
    color: colors.inkPrimary,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  trendingList: {
    gap: 4,
  },
});
