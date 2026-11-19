import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Sparkles } from 'lucide-react-native';
import { CollectionCard } from '../../components/pose/CollectionCard';
import { PoseCard } from '../../components/pose/PoseCard';
import { EmptyState } from '../../components/common/EmptyState';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { fetchCategories, fetchCollections, fetchPoses } from '../../services/supabase/api';
import { Category, Collection, Pose } from '../../types';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function ExploreScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const [cats, cols] = await Promise.all([fetchCategories(), fetchCollections()]);
      setCategories(cats);
      setCollections(cols);
    }
    load();
  }, []);

  useEffect(() => {
    async function filterPoses() {
      const data = await fetchPoses({
        categoryId: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        searchQuery: searchQuery || undefined,
      });
      setPoses(data);
    }
    filterPoses();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleSelectCat = (id: string | null) => {
    triggerHaptic('selection');
    setSelectedCategory(id);
  };

  const handleSelectDiff = (diff: string | null) => {
    triggerHaptic('selection');
    setSelectedDifficulty(selectedDifficulty === diff ? null : diff);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>POSE LIBRARY</Text>
          <Text style={styles.headerSubtitle}>DISCOVER & RECREATE CURATED INSPIRATIONS</Text>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrap}>
            <Search size={18} color={colors.inkPrimary} strokeWidth={2.5} />
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH BY TITLE, MOOD, OCCASION..."
              placeholderTextColor={colors.inkSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <Pressable
                style={styles.clearBtn}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearText}>CLEAR</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Category Horizontal Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsScroll}
          >
            <Pressable
              style={({ pressed }) => [
                styles.pill,
                selectedCategory === null && styles.pillActive,
                pressed && styles.pressed,
              ]}
              onPress={() => handleSelectCat(null)}
            >
              <Text style={[styles.pillText, selectedCategory === null && styles.pillTextActive]}>
                ALL
              </Text>
            </Pressable>

            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={({ pressed }) => [
                  styles.pill,
                  selectedCategory === c.id && styles.pillActive,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSelectCat(c.id)}
              >
                <Text style={[styles.pillText, selectedCategory === c.id && styles.pillTextActive]}>
                  {c.name.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Filter Pills (Difficulty) */}
          <View style={styles.filtersRow}>
            <Text style={styles.filterLabel}>LEVEL:</Text>
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <Pressable
                key={lvl}
                style={({ pressed }) => [
                  styles.diffFilterPill,
                  selectedDifficulty === lvl && styles.diffFilterPillActive,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSelectDiff(lvl)}
              >
                <Text
                  style={[
                    styles.diffFilterText,
                    selectedDifficulty === lvl && styles.diffFilterTextActive,
                  ]}
                >
                  {lvl.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Curated Collection Showcase (shown if viewing All) */}
          {!selectedCategory && !searchQuery && collections.length > 0 && (
            <View style={styles.collectionSection}>
              <View style={styles.sectionTitleRow}>
                <Sparkles size={14} color={colors.pixelGreen} strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>FEATURED COLLECTION</Text>
              </View>
              <CollectionCard collection={collections[0]} />
            </View>
          )}

          {/* Poses List */}
          <View style={styles.poseListSection}>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsCount}>{poses.length} POSES AVAILABLE</Text>
              <View style={styles.resultsIndicator} />
            </View>

            {poses.length === 0 ? (
              <EmptyState
                icon={<Search size={24} color={colors.inkPrimary} strokeWidth={2.5} />}
                title="NO POSES FOUND"
                description="Try adjusting your filters or search keywords."
                actionTitle="RESET FILTERS"
                onAction={() => {
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                  setSearchQuery('');
                }}
              />
            ) : (
              poses.map((pose) => (
                <PoseCard key={pose.id} pose={pose} layout="full" />
              ))
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
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...shadows.hard,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.monoMedium,
    color: colors.inkPrimary,
  },
  clearBtn: {
    backgroundColor: colors.pixelYellow,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  clearText: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  pillsScroll: {
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    ...shadows.hardXs,
  },
  pillActive: {
    backgroundColor: colors.pixelGreen,
  },
  pillText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.4,
  },
  pillTextActive: {
    color: colors.white,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginRight: 2,
  },
  diffFilterPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  diffFilterPillActive: {
    backgroundColor: colors.pixelYellow,
  },
  diffFilterText: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  diffFilterTextActive: {
    color: colors.inkPrimary,
  },
  collectionSection: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  poseListSection: {
    marginTop: 4,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.pixelOrange,
    letterSpacing: 0.5,
  },
  resultsIndicator: {
    width: 8,
    height: 8,
    backgroundColor: colors.pixelGreen,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
});
