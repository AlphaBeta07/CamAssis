import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BrandLogo } from '../components/common/BrandLogo';
import { router } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { DottedBackground } from '../components/common/DottedBackground';
import { colors, fonts, shadows } from '../theme';

export default function Index() {
  const { isOnboarded, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!isOnboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/home');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isOnboarded, isLoading]);

  return (
    <DottedBackground>
      <StatusBar style="dark" hidden={false} />
      <View style={styles.container}>
        <View style={styles.brandCenter}>
          <View style={styles.logoBadge}>
            <BrandLogo size={52} />
          </View>
          <Text style={styles.appName}>CAMASSIS</Text>
          <Text style={styles.tagline}>AI PHOTOGRAPHY ASSISTANT</Text>
        </View>

        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.pixelYellow} />
        </View>
      </View>
    </DottedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  brandCenter: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.hard,
  },
  appName: {
    fontSize: 24,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 10,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    marginTop: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
});
