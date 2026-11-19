import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Camera, Sparkles } from 'lucide-react-native';
import { Pose } from '../../types';
import { colors, fonts, shadows } from '../../theme';
import { router } from 'expo-router';
import { usePoseStore } from '../../store/usePoseStore';
import { triggerHaptic } from '../../services/haptics/haptics';

interface PoseCardProps {
  pose: Pose;
  layout?: 'grid' | 'full';
}

export const PoseCard: React.FC<PoseCardProps> = ({
  pose,
  layout = 'grid',
}) => {
  const { favorites, toggleFavorite, setSelectedPose } = usePoseStore();
  const isFav = favorites.includes(pose.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic('selection');
    toggleFavorite(pose.id);
  };

  const handleUsePosePress = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic('impactMedium');
    setSelectedPose(pose);
    router.push('/pose/prepare');
  };

  const handleCardPress = () => {
    triggerHaptic('impactLight');
    setSelectedPose(pose);
    router.push({
      pathname: '/pose/[id]',
      params: { id: pose.id },
    });
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        layout === 'full' ? styles.cardFull : styles.cardGrid,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Pose Reference Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pose.reference_image_url }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* Favorite Heart Button */}
        <Pressable
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Heart
            size={16}
            color={isFav ? colors.pixelOrange : colors.inkPrimary}
            fill={isFav ? colors.pixelOrange : 'transparent'}
            strokeWidth={2.5}
          />
        </Pressable>

        {/* AI Landmark Availability Badge */}
        {pose.has_landmarks && (
          <View style={styles.aiBadge}>
            <Sparkles size={11} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.aiBadgeText}>AI READY</Text>
          </View>
        )}

        {/* Difficulty Pill */}
        <View style={styles.difficultyPill}>
          <Text style={styles.difficultyText}>{pose.difficulty.toUpperCase()}</Text>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>{pose.category_name || 'LIFESTYLE'}</Text>
          <Text style={styles.framingText}>• {pose.body_framing.toUpperCase()}</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {pose.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {pose.description}
        </Text>

        {/* Action Button: Use Pose */}
        <Pressable
          style={({ pressed }) => [
            styles.usePoseButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleUsePosePress}
        >
          <Camera size={14} color={colors.inkPrimary} strokeWidth={2.5} />
          <Text style={styles.usePoseText}>TRY POSE</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  cardGrid: {
    width: '100%',
    marginBottom: 16,
  },
  cardFull: {
    width: '100%',
    marginBottom: 20,
  },
  cardPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 210,
    backgroundColor: colors.creamLight,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  aiBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pixelGreen,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  aiBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  difficultyPill: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  difficultyText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    padding: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.pixelOrange,
    letterSpacing: 0.5,
  },
  framingText: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    marginLeft: 4,
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  usePoseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 8,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  buttonPressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  usePoseText: {
    color: colors.inkPrimary,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
});
