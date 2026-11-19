import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  Trash2,
  Heart,
  Camera,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';
import { usePoseStore } from '../../store/usePoseStore';
import { router } from 'expo-router';
import { triggerHaptic } from '../../services/haptics/haptics';
import { BrandLogo } from '../../components/common/BrandLogo';

export default function ProfileScreen() {
  const { user, isGuest, logout, deleteAccount } = useAuthStore();
  const { favorites } = usePoseStore();

  const handleLogout = () => {
    triggerHaptic('impactLight');
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    triggerHaptic('impactHeavy');
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account, preferences, and cloud profile metadata.\n\nCaptured photos saved directly in your device gallery will not be affected.\n\nAre you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROFILE</Text>
          <Text style={styles.headerSubtitle}>USER SETTINGS & SYSTEM STATUS</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* User Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <User size={30} color={colors.inkPrimary} strokeWidth={2.5} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.full_name?.toUpperCase() || 'GUEST EXPLORER'}</Text>
              <Text style={styles.userEmail}>
                {isGuest ? 'BROWSING AS GUEST' : user?.email}
              </Text>
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>GUEST MODE</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.pixelYellow }]}>
              <Heart size={18} color={colors.inkPrimary} strokeWidth={2.5} />
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>FAVORITES</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.pixelOrange }]}>
              <Camera size={18} color={colors.white} strokeWidth={2.5} />
              <Text style={[styles.statNumber, { color: colors.white }]}>LOCAL</Text>
              <Text style={[styles.statLabel, { color: colors.white }]}>SENSOR</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.pixelGreen }]}>
              <Sparkles size={18} color={colors.white} strokeWidth={2.5} />
              <Text style={[styles.statNumber, { color: colors.white }]}>33 PTS</Text>
              <Text style={[styles.statLabel, { color: colors.white }]}>AI COACH</Text>
            </View>
          </View>

          {/* Guest Upsell if in Guest Mode */}
          {isGuest && (
            <View style={styles.upsellCard}>
              <Text style={styles.upsellTitle}>SYNC POSES ACROSS DEVICES</Text>
              <Text style={styles.upsellText}>
                Create an account or sign in to save your customized poses and preferences.
              </Text>
              <Button
                title="SIGN IN / REGISTER"
                variant="primary"
                size="sm"
                onPress={() => router.push('/auth/login')}
                style={styles.signInBtn}
              />
            </View>
          )}

          {/* Menu Items */}
          <View style={styles.menuCard}>
            <Pressable
              style={({ pressed }) => [
                styles.menuRow,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push('/settings')}
            >
              <View style={styles.menuIconWrap}>
                <Settings size={18} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuTitle}>CAMERA & APP SETTINGS</Text>
              <ChevronRight size={18} color={colors.inkPrimary} strokeWidth={2.5} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuRow,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push('/settings/privacy')}
            >
              <View style={styles.menuIconWrap}>
                <Shield size={18} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuTitle}>PRIVACY & DATA POLICY</Text>
              <ChevronRight size={18} color={colors.inkPrimary} strokeWidth={2.5} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuRow,
                styles.menuRowLast,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push('/settings/help')}
            >
              <View style={styles.menuIconWrap}>
                <HelpCircle size={18} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuTitle}>HELP & PHOTOGRAPHY GUIDE</Text>
              <ChevronRight size={18} color={colors.inkPrimary} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Logout & Delete Account Buttons */}
          {!isGuest && (
            <View style={styles.authActionGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.logoutBtn,
                  pressed && styles.pressed,
                ]}
                onPress={handleLogout}
              >
                <LogOut size={16} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.logoutText}>SIGN OUT</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.deleteAccountBtn,
                  pressed && styles.pressed,
                ]}
                onPress={handleDeleteAccount}
              >
                <Trash2 size={14} color={colors.error} strokeWidth={2.5} />
                <Text style={styles.deleteAccountText}>DELETE ACCOUNT</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.brandFooter}>
            <BrandLogo size={44} />
            <Text style={styles.brandFooterTitle}>CAMASSIS</Text>
            <Text style={styles.brandFooterTagline}>YOUR PERSONAL AI PHOTOGRAPHY ASSISTANT</Text>
          </View>

          <Text style={styles.versionText}>CAMASSIS V2.0.0 • RETRO PIXEL EDITION</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 16,
    ...shadows.hard,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    ...shadows.hardXs,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    marginBottom: 6,
  },
  guestBadge: {
    backgroundColor: colors.pixelOrange,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  guestBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    ...shadows.hard,
  },
  statNumber: {
    fontSize: 13,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.4,
  },
  upsellCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    marginBottom: 16,
    ...shadows.hard,
  },
  upsellTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 6,
  },
  upsellText: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  signInBtn: {
    alignSelf: 'flex-start',
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 20,
    ...shadows.hard,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderPrimary,
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 2,
    backgroundColor: colors.creamLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.3,
  },
  authActionGroup: {
    marginBottom: 20,
    gap: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.inkPrimary,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 12,
    ...shadows.hard,
  },
  logoutText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  deleteAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: 2,
    paddingVertical: 10,
    ...shadows.hardXs,
  },
  deleteAccountText: {
    color: colors.error,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  brandFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginTop: 12,
  },
  brandFooterTitle: {
    fontFamily: fonts.pixel,
    fontSize: 14,
    color: colors.inkPrimary,
    marginTop: 10,
    letterSpacing: -0.5,
  },
  brandFooterTagline: {
    fontFamily: fonts.monoMedium,
    fontSize: 8.5,
    color: colors.pixelGreen,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    marginTop: 8,
  },
});
