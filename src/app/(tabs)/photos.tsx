import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import {
  ShieldCheck,
  ExternalLink,
  FolderHeart,
} from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { PixelArtIllustration } from '../../components/common/PixelArtIllustration';
import { colors, fonts, shadows } from '../../theme';
import { getCamAssisAlbumPhotos } from '../../services/media-library/photoSaver';
import * as MediaLibrary from 'expo-media-library/legacy';
import { router } from 'expo-router';
import { triggerHaptic } from '../../services/haptics/haptics';

const { width } = Dimensions.get('window');
const COLUMN_SIZE = (width - 48) / 3;

export default function MyPhotosScreen() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);

  const loadLocalAlbum = async () => {
    const assets = await getCamAssisAlbumPhotos(30);
    setPhotos(assets);
  };

  useEffect(() => {
    loadLocalAlbum();
  }, []);

  const openNativeGallery = () => {
    triggerHaptic('impactMedium');
    if (Platform.OS === 'ios') {
      Linking.openURL('photos-redirect://').catch(() => {
        Linking.openSettings();
      });
    } else {
      Linking.openURL('content://media/internal/images/media').catch(() => {
        Linking.openSettings();
      });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MY PHOTOS</Text>
          <Text style={styles.headerSubtitle}>SAVED DIRECTLY TO NATIVE PHONE GALLERY</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Privacy & Direct-to-Device Notice Card */}
          <View style={styles.privacyCard}>
            <View style={styles.privacyHeader}>
              <View style={styles.shieldBadge}>
                <ShieldCheck size={20} color={colors.white} strokeWidth={2.5} />
              </View>
              <View style={styles.privacyHeaderText}>
                <Text style={styles.privacyTitle}>DIRECT DEVICE SAVING</Text>
                <Text style={styles.privacySub}>100% PRIVATE • ZERO CLOUD UPLOADS</Text>
              </View>
            </View>

            <Text style={styles.privacyBody}>
              Every picture you snap in CamAssis automatically saves into your native phone Photos in the dedicated <Text style={styles.bold}>CamAssis</Text> album. No captured photographs ever leave your phone.
            </Text>

            <Button
              title="OPEN PHONE GALLERY"
              variant="primary"
              size="md"
              icon={<ExternalLink size={15} color={colors.inkPrimary} strokeWidth={2.5} />}
              iconPosition="right"
              onPress={openNativeGallery}
              style={styles.openGalleryBtn}
            />
          </View>

          {/* CamAssis Album Header */}
          <View style={styles.sectionRow}>
            <View style={styles.sectionTitleRow}>
              <FolderHeart size={16} color={colors.pixelGreen} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>CAMASSIS ALBUM</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.refreshBtn,
                pressed && styles.pressed,
              ]}
              onPress={loadLocalAlbum}
            >
              <Text style={styles.refreshText}>REFRESH</Text>
            </Pressable>
          </View>

          {photos.length === 0 ? (
            <View style={styles.emptyAlbumCard}>
              <PixelArtIllustration type="empty-photos" size={80} />
              <Text style={styles.emptyTitle}>NO PHOTOS YET</Text>
              <Text style={styles.emptySubtitle}>
                Open Ghost Camera, align with any transparent pose guide, and take a shot. It will instantly appear here and in your phone library.
              </Text>
              <Button
                title="LAUNCH GHOST CAMERA"
                variant="primary"
                size="md"
                onPress={() => router.push('/camera')}
                style={styles.openCameraBtn}
              />
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {photos.map((item) => (
                <View key={item.id} style={styles.photoItem}>
                  <Image source={{ uri: item.uri }} style={styles.photoImage} contentFit="cover" />
                </View>
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
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  privacyCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    marginBottom: 20,
    ...shadows.hard,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  shieldBadge: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.pixelGreen,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  privacyHeaderText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 12,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  privacySub: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  privacyBody: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  bold: {
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  openGalleryBtn: {
    width: '100%',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  refreshBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    ...shadows.hardXs,
  },
  refreshText: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  emptyAlbumCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 24,
    alignItems: 'center',
    ...shadows.hard,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  openCameraBtn: {
    minWidth: 180,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: COLUMN_SIZE,
    height: COLUMN_SIZE,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
    backgroundColor: colors.creamLight,
    ...shadows.hardXs,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
});
