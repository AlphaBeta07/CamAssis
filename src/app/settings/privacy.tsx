import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ShieldCheck, Lock, HardDrive, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
            <Text style={styles.headerSubtitle}>ON-DEVICE DATA GUARANTEE</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Core Guarantee Banner */}
          <View style={styles.guaranteeCard}>
            <ShieldCheck size={26} color={colors.pixelGreen} strokeWidth={2.5} />
            <Text style={styles.guaranteeTitle}>YOUR PHOTOS BELONG TO YOU</Text>
            <Text style={styles.guaranteeText}>
              CamAssis is built on privacy-by-design. We never upload, inspect, or retain your captured photographs on any remote server.
            </Text>
          </View>

          {/* Section 1: Zero Cloud Upload */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.pixelYellow }]}>
                <HardDrive size={16} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>01. DIRECT NATIVE PHOTO SAVING</Text>
            </View>
            <Text style={styles.sectionBody}>
              When you press the capture button in Ghost Pose Camera, the original photograph is transferred directly from the native camera sensor into your device's native Gallery/Photos album ("CamAssis"). CamAssis does not transmit images to any cloud server.
            </Text>
          </View>

          {/* Section 2: On-Device AI */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.pixelGreen }]}>
                <EyeOff size={16} color={colors.white} strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>02. ON-DEVICE AI POSE DETECTION</Text>
            </View>
            <Text style={styles.sectionBody}>
              Body pose estimation and 33-landmark matching run entirely on your local device hardware. Camera preview frames are evaluated in volatile memory and are never stored or transmitted over the network.
            </Text>
          </View>

          {/* Section 3: Account & Sync Data */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.pixelBlue }]}>
                <Lock size={16} color={colors.white} strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>03. ACCOUNT & PREFERENCES</Text>
            </View>
            <Text style={styles.sectionBody}>
              If you register an account, we sync non-image preferences such as favorite pose bookmarks and UI configurations in Supabase. Guest users maintain all data exclusively in device local storage.
            </Text>
          </View>

          <Text style={styles.footerNote}>
            LAST UPDATED: FEBRUARY 2026 • CAMASSIS SECURITY TEAM
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: colors.cream,
  },
  backBtn: {
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 9,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  guaranteeCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 16,
    ...shadows.hard,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  guaranteeText: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 14,
    ...shadows.hard,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.3,
  },
  sectionBody: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 18,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    marginTop: 12,
  },
});
