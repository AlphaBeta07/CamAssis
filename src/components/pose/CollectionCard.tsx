import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { Collection } from '../../types';
import { colors, fonts, shadows } from '../../theme';
import { router } from 'expo-router';
import { triggerHaptic } from '../../services/haptics/haptics';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const handlePress = () => {
    triggerHaptic('impactLight');
    router.push({
      pathname: '/collection/[id]',
      params: { id: collection.id, name: collection.name },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <Image
        source={{ uri: collection.cover_image_url }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.featuredBadge}>
          <Sparkles size={11} color={colors.inkPrimary} strokeWidth={2.5} />
          <Text style={styles.badgeText}>CURATED</Text>
        </View>

        <Text style={styles.name}>{collection.name.toUpperCase()}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {collection.description}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.exploreText}>VIEW COLLECTION</Text>
          <ArrowRight size={14} color={colors.pixelYellow} strokeWidth={3} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 190,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: colors.white,
    ...shadows.hard,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 37, 29, 0.65)',
  },
  content: {
    ...StyleSheet.absoluteFill,
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 8,
    ...shadows.hardXs,
  },
  badgeText: {
    color: colors.inkPrimary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  name: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.pixel,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    color: colors.creamLight,
    fontSize: 12,
    fontFamily: fonts.mono,
    lineHeight: 16,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exploreText: {
    color: colors.pixelYellow,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
});
