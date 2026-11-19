import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Sparkles,
  Layers,
  Compass,
  ArrowRight,
  Check,
} from 'lucide-react-native';
import { BrandLogo } from '../components/common/BrandLogo';
import { Button } from '../components/common/Button';
import { colors, fonts, shadows } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { triggerHaptic } from '../services/haptics/haptics';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'CAMASSIS V2.0',
    title: 'YOUR PERSONAL AI\nPHOTO ASSISTANT',
    subtitle:
      'Never wonder how to stand, look, or position your arms again. Discover poses and capture stunning photos effortlessly.',
    image:
      'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1000&q=80',
    icon: <BrandLogo size={18} />,
  },
  {
    id: '2',
    badge: 'CURATED INSPIRATION',
    title: 'DISCOVER HUNDREDS\nOF PRO POSES',
    subtitle:
      'Browse categorized collections from sunny beach days to aesthetic mirror selfies and golden hour couple portraits.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    icon: <Compass size={16} color={colors.inkPrimary} strokeWidth={2.5} />,
  },
  {
    id: '3',
    badge: 'GHOST CAMERA',
    title: 'TRANSPARENT POSE\nVIEWFINDER OVERLAY',
    subtitle:
      'Superimpose the pose outline directly onto your live camera preview with adjustable transparency to match angles perfectly.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    icon: <Layers size={16} color={colors.inkPrimary} strokeWidth={2.5} />,
  },
  {
    id: '4',
    badge: 'ON-DEVICE AI',
    title: 'REAL-TIME BODY\nPOSE COACHING',
    subtitle:
      'Intelligent on-device AI tracks 33 body landmarks to give you live guidance: adjust shoulders, tilt head, and nail posture.',
    image:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
    icon: <Sparkles size={16} color={colors.inkPrimary} strokeWidth={2.5} />,
  },
  {
    id: '5',
    badge: 'DEVICE PRIVACY',
    title: 'INSTANT CAPTURE,\nZERO CLOUD UPLOADS',
    subtitle:
      'Every photograph is automatically saved directly to your phone Gallery. 100% private and always ready for the next shot.',
    image:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
    icon: <Check size={16} color={colors.inkPrimary} strokeWidth={2.5} />,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding, continueAsGuest } = useAuthStore();

  const handleNext = async () => {
    triggerHaptic('impactLight');
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding();
      router.replace('/auth/login');
    }
  };

  const handleSkip = async () => {
    triggerHaptic('impactLight');
    await completeOnboarding();
    await continueAsGuest();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" hidden={false} />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIdx);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.bgImage} contentFit="cover" />
            <View style={styles.darkScrim} />

            <SafeAreaView edges={['top']} style={styles.slideContent}>
              <View style={styles.topRow}>
                <View style={styles.badgePill}>
                  {item.icon}
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>

                {currentIndex < SLIDES.length - 1 && (
                  <Pressable onPress={handleSkip} style={styles.skipBtn}>
                    <Text style={styles.skipText}>SKIP</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.cardBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </SafeAreaView>
          </View>
        )}
      />

      {/* Footer Navigation Bar */}
      <SafeAreaView edges={['bottom']} style={styles.footerBar}>
        {/* Pagination Dots (Square brutalist blocks) */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          <Button
            title={currentIndex === SLIDES.length - 1 ? 'GET STARTED' : 'CONTINUE'}
            variant="primary"
            size="lg"
            icon={<ArrowRight size={16} color={colors.inkPrimary} strokeWidth={2.5} />}
            iconPosition="right"
            onPress={handleNext}
            style={styles.nextBtn}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  slide: {
    width,
    height,
    position: 'relative',
  },
  bgImage: {
    width,
    height,
    position: 'absolute',
  },
  darkScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 37, 29, 0.6)',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 130,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  badgeText: {
    color: colors.inkPrimary,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  skipText: {
    color: colors.inkPrimary,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  cardBox: {
    backgroundColor: colors.creamLight,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 18,
    marginBottom: 10,
    ...shadows.hard,
  },
  title: {
    color: colors.inkPrimary,
    fontSize: 18,
    fontFamily: fonts.pixel,
    lineHeight: 26,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.inkSecondary,
    fontSize: 12,
    fontFamily: fonts.mono,
    lineHeight: 18,
  },
  footerBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    height: 8,
    borderRadius: 1,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.pixelYellow,
  },
  dotInactive: {
    width: 10,
    backgroundColor: colors.white,
  },
  buttonRow: {
    width: '100%',
  },
  nextBtn: {
    width: '100%',
  },
});
