import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search as SearchIcon, ArrowLeft, X, Sparkles, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { PoseCard } from '../components/pose/PoseCard';
import { EmptyState } from '../components/common/EmptyState';
import { DottedBackground } from '../components/common/DottedBackground';
import { colors, fonts, shadows } from '../theme';
import { fetchPoses } from '../services/supabase/api';
import { Pose } from '../types';
import { triggerHaptic } from '../services/haptics/haptics';

const SUGGESTIONS = ['BEACH', 'SITTING', 'SUNSET', 'CANDID', 'SELFIE', 'READING', 'COUPLE', 'FASHION'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pose[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['BEACH', 'READING', 'GOLDEN HOUR']);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const data = await fetchPoses({ searchQuery: query.trim() });
      setResults(data);
    }
    search();
  }, [query]);

  const handleSelectKeyword = (kw: string) => {
    triggerHaptic('selection');
    setQuery(kw);
    if (!recentSearches.includes(kw)) {
      setRecentSearches([kw, ...recentSearches.slice(0, 4)]);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        {/* Search Bar Header */}
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

          <View style={styles.inputWrap}>
            <SearchIcon size={16} color={colors.inkPrimary} strokeWidth={2.5} />
            <TextInput
              style={styles.input}
              placeholder="SEARCH POSES, STYLES, ANGLES..."
              placeholderTextColor={colors.inkSecondary}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query ? (
              <Pressable onPress={() => setQuery('')}>
                <X size={16} color={colors.inkPrimary} strokeWidth={2.5} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {!query ? (
            <View>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Clock size={14} color={colors.pixelGreen} strokeWidth={2.5} />
                    <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                  </View>
                  <View style={styles.keywordsWrap}>
                    {recentSearches.map((kw) => (
                      <Pressable
                        key={kw}
                        style={({ pressed }) => [
                          styles.keywordPill,
                          pressed && styles.pressed,
                        ]}
                        onPress={() => handleSelectKeyword(kw)}
                      >
                        <Text style={styles.keywordText}>{kw}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Popular Suggestions */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Sparkles size={14} color={colors.pixelYellow} strokeWidth={2.5} />
                  <Text style={styles.sectionTitle}>POPULAR SUGGESTIONS</Text>
                </View>
                <View style={styles.keywordsWrap}>
                  {SUGGESTIONS.map((sug) => (
                    <Pressable
                      key={sug}
                      style={({ pressed }) => [
                        styles.keywordPill,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => handleSelectKeyword(sug)}
                    >
                      <Text style={styles.keywordText}>{sug}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              <View style={styles.resultsRow}>
                <Text style={styles.resultsCount}>
                  {results.length} RESULT{results.length === 1 ? '' : 'S'} FOR "{query.toUpperCase()}"
                </Text>
                <View style={styles.resultsIndicator} />
              </View>

              {results.length === 0 ? (
                <EmptyState
                  icon={<SearchIcon size={24} color={colors.inkPrimary} strokeWidth={2.5} />}
                  title="NO POSES FOUND"
                  description={`We couldn't find any poses matching "${query}". Try searching for Beach, Selfies, or Sitting.`}
                  actionTitle="CLEAR SEARCH"
                  onAction={() => setQuery('')}
                />
              ) : (
                results.map((pose) => (
                  <PoseCard key={pose.id} pose={pose} layout="full" />
                ))
              )}
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
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: colors.cream,
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
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    ...shadows.hardXs,
  },
  input: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.monoMedium,
    color: colors.inkPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  keywordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    ...shadows.hardXs,
  },
  keywordText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  resultsContainer: {
    marginTop: 4,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
