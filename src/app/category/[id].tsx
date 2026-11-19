import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PoseCard } from '../../components/pose/PoseCard';
import { EmptyState } from '../../components/common/EmptyState';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { fetchCategories, fetchPoses } from '../../services/supabase/api';
import { Category, Pose } from '../../types';

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [poses, setPoses] = useState<Pose[]>([]);

  useEffect(() => {
    async function load() {
      const cats = await fetchCategories();
      const current = cats.find((c) => c.id === id || c.slug === id);
      if (current) setCategory(current);

      const poseList = await fetchPoses({ categoryId: current?.id || id });
      setPoses(poseList);
    }
    load();
  }, [id]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        {/* Top Header */}
        <View style={styles.navHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.navTitle}>
              {(category?.name || name || 'CATEGORY').toUpperCase()}
            </Text>
            <Text style={styles.navSubtitle}>CURATED POSE COLLECTION</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Cover Card */}
          {category && (
            <View style={styles.coverCard}>
              <Image
                source={{ uri: category.cover_image_url }}
                style={styles.coverImage}
                contentFit="cover"
              />
              <View style={styles.coverOverlay} />
              <View style={styles.coverContent}>
                <Text style={styles.coverTitle}>{category.name.toUpperCase()} POSES</Text>
                <Text style={styles.coverDesc}>{category.description}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{poses.length} POSES AVAILABLE</Text>
                </View>
              </View>
            </View>
          )}

          {/* Poses */}
          <View style={styles.poseList}>
            {poses.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={24} color={colors.inkPrimary} strokeWidth={2.5} />}
                title="NO POSES YET"
                description="New poses for this category will be available soon."
                actionTitle="BACK TO EXPLORE"
                onAction={() => router.back()}
              />
            ) : (
              poses.map((pose) => <PoseCard key={pose.id} pose={pose} layout="full" />)
            )}
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
  navHeader: {
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
  navTitle: {
    fontSize: 15,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
  },
  navSubtitle: {
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
  coverCard: {
    height: 180,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: colors.white,
    ...shadows.hard,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 37, 29, 0.65)',
  },
  coverContent: {
    ...StyleSheet.absoluteFill,
    padding: 16,
    justifyContent: 'flex-end',
  },
  coverTitle: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.pixel,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  coverDesc: {
    color: colors.creamLight,
    fontSize: 11,
    fontFamily: fonts.mono,
    lineHeight: 16,
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    alignSelf: 'flex-start',
    ...shadows.hardXs,
  },
  countBadgeText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  poseList: {
    marginTop: 4,
  },
});
