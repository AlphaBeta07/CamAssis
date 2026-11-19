import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Category } from '../../types';
import { colors, fonts, shadows } from '../../theme';
import { router } from 'expo-router';
import { triggerHaptic } from '../../services/haptics/haptics';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress?: () => void;
  variant?: 'pill' | 'card';
  colorIndex?: number;
}

const CATEGORY_COLORS = [
  colors.pixelYellow,
  colors.pixelOrange,
  colors.pixelBlue,
  colors.pixelGreen,
];

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
  variant = 'card',
  colorIndex = 0,
}) => {
  const accentColor = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length];

  const handlePress = () => {
    triggerHaptic('selection');
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/category/[id]',
        params: { id: category.id, name: category.name },
      });
    }
  };

  if (variant === 'pill') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.pill,
          isSelected && styles.pillSelected,
          pressed && styles.pressed,
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
          {category.name.toUpperCase()}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <Image
        source={{ uri: category.cover_image_url }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={[styles.colorBar, { backgroundColor: accentColor }]} />
      <View style={styles.textWrap}>
        <Text style={styles.cardName} numberOfLines={1}>
          {category.name.toUpperCase()}
        </Text>
        {category.pose_count ? (
          <Text style={styles.cardCount}>{category.pose_count} POSES</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginRight: 8,
    ...shadows.hardXs,
  },
  pillSelected: {
    backgroundColor: colors.pixelGreen,
    borderColor: colors.borderPrimary,
  },
  pillText: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  pillTextSelected: {
    color: colors.white,
  },
  card: {
    width: 116,
    height: 130,
    borderRadius: 2,
    position: 'relative',
    marginRight: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 80,
  },
  colorBar: {
    height: 4,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderPrimary,
  },
  textWrap: {
    padding: 6,
    backgroundColor: colors.creamLight,
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    color: colors.inkPrimary,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.3,
  },
  cardCount: {
    color: colors.inkSecondary,
    fontSize: 9,
    fontFamily: fonts.mono,
    marginTop: 2,
  },
});
