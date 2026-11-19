import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Search, User } from 'lucide-react-native';
import { BrandLogo } from './BrandLogo';
import { colors, fonts, shadows } from '../../theme';
import { router } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'CAMASSIS',
  subtitle = 'AI PHOTOGRAPHY ASSISTANT',
  showSearch = true,
  showProfile = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <BrandLogo size={22} />
          </View>
          <Text style={styles.brandTitle}>{title}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rightCol}>
        {showSearch && (
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.push('/search')}
          >
            <Search size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
        )}
        {showProfile && (
          <Pressable
            style={({ pressed }) => [
              styles.profileBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <User size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.cream,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
  },
  leftCol: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  brandTitle: {
    fontSize: 15,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
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
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  btnPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
});
