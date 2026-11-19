import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Heart } from 'lucide-react-native';
import { PoseCard } from '../../components/pose/PoseCard';
import { EmptyState } from '../../components/common/EmptyState';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts } from '../../theme';
import { usePoseStore } from '../../store/usePoseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchPoses } from '../../services/supabase/api';
import { Pose } from '../../types';
import { router } from 'expo-router';

export default function FavoritesScreen() {
  const [favoritePoses, setFavoritePoses] = useState<Pose[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { favorites, loadFavorites } = usePoseStore();
  const { user } = useAuthStore();

  const loadData = async () => {
    try {
      await loadFavorites(user?.id);
      const allPoses = await fetchPoses();
      const filtered = allPoses.filter((p) => favorites.includes(p.id));
      setFavoritePoses(filtered);
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SAVED POSES</Text>
          <Text style={styles.headerSubtitle}>
            YOUR PERSONAL REPERTOIRE FOR QUICK CAPTURE
          </Text>
        </View>

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
          {favoritePoses.length === 0 ? (
            <EmptyState
              icon={<Heart size={28} color={colors.inkPrimary} strokeWidth={2.5} />}
              title="NO SAVED POSES YET"
              description="Explore the pose library and tap the heart icon on any pose you love to save it here."
              actionTitle="DISCOVER POSES"
              onAction={() => router.push('/(tabs)/explore')}
            />
          ) : (
            <View style={styles.list}>
              <View style={styles.countRow}>
                <Text style={styles.countText}>{favoritePoses.length} POSES IN COLLECTION</Text>
                <View style={styles.countIndicator} />
              </View>
              {favoritePoses.map((pose) => (
                <PoseCard key={pose.id} pose={pose} layout="full" />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: colors.cream,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  list: {
    width: '100%',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.pixelOrange,
    letterSpacing: 0.5,
  },
  countIndicator: {
    width: 8,
    height: 8,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
});
