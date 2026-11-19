import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Shield,
} from 'lucide-react-native';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { OverlayMode } from '../../types';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const { user } = useAuthStore();

  const handleToggleHaptics = (val: boolean) => {
    triggerHaptic('selection');
    updateSettings({ haptics_enabled: val }, user?.id);
  };

  const handleToggleAi = (val: boolean) => {
    triggerHaptic('selection');
    updateSettings({ ai_pose_coach_enabled: val }, user?.id);
  };

  const handleToggleGrid = (val: boolean) => {
    triggerHaptic('selection');
    updateSettings({ show_grid_by_default: val }, user?.id);
  };

  const handleChangeDefaultOpacity = (val: number) => {
    updateSettings({ default_overlay_opacity: val }, user?.id);
  };

  const handleChangeDefaultMode = (mode: OverlayMode) => {
    triggerHaptic('selection');
    updateSettings({ default_overlay_mode: mode }, user?.id);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>SETTINGS</Text>
            <Text style={styles.headerSubtitle}>CAMERA PREFERENCES & HARDWARE</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Camera Overlay Preferences */}
          <Text style={styles.groupTitle}>CAMERA & POSE OVERLAY</Text>
          <View style={styles.groupCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelCol}>
                <Text style={styles.settingTitle}>DEFAULT OVERLAY MODE</Text>
                <Text style={styles.settingDesc}>Choose default ghost guide visualization</Text>
              </View>
            </View>
            <View style={styles.modePillRow}>
              {(['photo', 'outline', 'both'] as OverlayMode[]).map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.modePill,
                    settings.default_overlay_mode === m && styles.modePillActive,
                  ]}
                  onPress={() => handleChangeDefaultMode(m)}
                >
                  <Text
                    style={[
                      styles.modePillText,
                      settings.default_overlay_mode === m && styles.modePillTextActive,
                    ]}
                  >
                    {m.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Default Opacity Slider */}
            <View style={[styles.settingRow, { marginTop: 14 }]}>
              <View style={styles.settingLabelCol}>
                <Text style={styles.settingTitle}>DEFAULT TRANSPARENCY</Text>
                <Text style={styles.settingDesc}>
                  {Math.round(settings.default_overlay_opacity * 100)}% GHOST OVERLAY OPACITY
                </Text>
              </View>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={0.9}
              value={settings.default_overlay_opacity}
              onValueChange={handleChangeDefaultOpacity}
              minimumTrackTintColor={colors.pixelGreen}
              maximumTrackTintColor={colors.cream}
              thumbTintColor={colors.pixelYellow}
            />

            {/* Grid by default */}
            <View style={styles.divider} />
            <View style={styles.switchRow}>
              <View style={styles.switchLabelCol}>
                <Text style={styles.settingTitle}>3X3 COMPOSITION GRID</Text>
                <Text style={styles.settingDesc}>Display grid lines by default on camera preview</Text>
              </View>
              <Switch
                value={settings.show_grid_by_default}
                onValueChange={handleToggleGrid}
                trackColor={{ false: colors.cream, true: colors.pixelGreen }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {/* AI & Haptics */}
          <Text style={styles.groupTitle}>AI COACH & SENSORS</Text>
          <View style={styles.groupCard}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabelCol}>
                <Text style={styles.settingTitle}>AI POSE COACH</Text>
                <Text style={styles.settingDesc}>
                  Real-time on-device 33-point body landmark tracking and guidance
                </Text>
              </View>
              <Switch
                value={settings.ai_pose_coach_enabled}
                onValueChange={handleToggleAi}
                trackColor={{ false: colors.cream, true: colors.pixelGreen }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLabelCol}>
                <Text style={styles.settingTitle}>HAPTIC FEEDBACK</Text>
                <Text style={styles.settingDesc}>
                  Tactile vibrations on shutter click, alignment match, and buttons
                </Text>
              </View>
              <Switch
                value={settings.haptics_enabled}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: colors.cream, true: colors.pixelGreen }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {/* Storage & Privacy Note */}
          <Text style={styles.groupTitle}>DIRECT GALLERY SAVING POLICY</Text>
          <View style={styles.infoCard}>
            <Shield size={20} color={colors.pixelGreen} strokeWidth={2.5} />
            <Text style={styles.infoText}>
              CamAssis automatically saves all captured photographs directly to your phone's native
              Gallery/Photos in the dedicated <Text style={styles.bold}>CamAssis</Text> album. No captured photographs are ever uploaded to any cloud backend.
            </Text>
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
  groupTitle: {
    fontSize: 10,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: -0.2,
  },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    padding: 14,
    marginBottom: 16,
    ...shadows.hard,
  },
  settingRow: {
    marginBottom: 8,
  },
  settingLabelCol: {
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 12,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
  },
  modePillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  modePill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 2,
    backgroundColor: colors.creamLight,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: colors.pixelYellow,
  },
  modePillText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  modePillTextActive: {
    color: colors.inkPrimary,
  },
  slider: {
    width: '100%',
    height: 32,
    marginTop: 4,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.borderPrimary,
    marginVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabelCol: {
    flex: 1,
    paddingRight: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    padding: 14,
    marginBottom: 24,
    ...shadows.hard,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 16,
  },
  bold: {
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
});
