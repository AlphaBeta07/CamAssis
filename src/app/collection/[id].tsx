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
import { fetchCollections, fetchPoses } from '../../services/supabase/api';
import { Collection, Pose } from '../../types';

export default function CollectionDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [poses, setPoses] = useState<Pose[]>([]);

  useEffect(() => {
    async function load() {
      const cols = await fetchCollections();
      const current = cols.find((c) => c.id === id || c.slug === id);
      if (current) setCollection(current);

      const poseList = await fetchPoses({ collectionId: current?.id || id });
      setPoses(poseList);
    }
    load();
  }, [id]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.navHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.navTitle}>
              {(collection?.name || name || 'COLLECTION').toUpperCase()}
            </Text>
            <Text style={styles.navSubtitle}>CURATED EDITORIAL SUITE</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {collection && (
            <View style={styles.bannerCard}>
              <Image
                source={{ uri: collection.cover_image_url }}
                style={styles.bannerImage}
                contentFit="cover"
              />
              <View style={styles.bannerOverlay} />
              <View style={styles.bannerContent}>
                <View style={styles.badgeRow}>
                  <Sparkles size={11} color={colors.inkPrimary} strokeWidth={2.5} />
                  <Text style={styles.badgeText}>CURATED COLLECTION</Text>
                </View>
                <Text style={styles.bannerTitle}>{collection.name.toUpperCase()}</Text>
                <Text style={styles.bannerDesc}>{collection.description}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{poses.length} POSES INCLUDED</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.posesSection}>
            {poses.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={24} color={colors.inkPrimary} strokeWidth={2.5} />}
                title="NO POSES IN COLLECTION"
                description="Poses for this collection are currently being photographed."
                actionTitle="BACK"
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
  bannerCard: {
    height: 200,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: colors.white,
    ...shadows.hard,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 37, 29, 0.65)',
  },
  bannerContent: {
    ...StyleSheet.absoluteFill,
    padding: 16,
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginBottom: 8,
    ...shadows.hardXs,
  },
  badgeText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.pixel,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  bannerDesc: {
    color: colors.creamLight,
    fontSize: 11,
    fontFamily: fonts.mono,
    lineHeight: 16,
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: colors.pixelGreen,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    alignSelf: 'flex-start',
    ...shadows.hardXs,
  },
  countText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  posesSection: {
    marginTop: 4,
  },
});
