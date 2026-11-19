import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { BrandLogo } from '../../components/common/BrandLogo';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, continueAsGuest } = useAuthStore();

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('PLEASE COMPLETE ALL FIELDS.');
      triggerHaptic('error');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await signup(email.trim(), password, fullName.trim());
    setLoading(false);

    if (res.success) {
      triggerHaptic('success');
      router.replace('/(tabs)/home');
    } else {
      triggerHaptic('error');
      setErrorMsg(res.error || 'SIGNUP FAILED. PLEASE TRY AGAIN.');
    }
  };

  const handleGuest = async () => {
    triggerHaptic('impactLight');
    await continueAsGuest();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <BrandLogo size={34} />
            </View>
            <Text style={styles.brandTitle}>JOIN CAMASSIS</Text>
            <Text style={styles.brandSubtitle}>
              CREATE AN ACCOUNT FOR MULTI-DEVICE SYNC
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              <View style={styles.inputWrap}>
                <User size={16} color={colors.inkPrimary} style={styles.inputIcon} strokeWidth={2.5} />
                <TextInput
                  style={styles.textInput}
                  placeholder="FULL NAME"
                  placeholderTextColor={colors.inkSecondary}
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    setErrorMsg('');
                  }}
                />
              </View>

              <View style={styles.inputWrap}>
                <Mail size={16} color={colors.inkPrimary} style={styles.inputIcon} strokeWidth={2.5} />
                <TextInput
                  style={styles.textInput}
                  placeholder="EMAIL ADDRESS"
                  placeholderTextColor={colors.inkSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setErrorMsg('');
                  }}
                />
              </View>

              <View style={styles.inputWrap}>
                <Lock size={16} color={colors.inkPrimary} style={styles.inputIcon} strokeWidth={2.5} />
                <TextInput
                  style={styles.textInput}
                  placeholder="PASSWORD (MIN 6 CHARACTERS)"
                  placeholderTextColor={colors.inkSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setErrorMsg('');
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? (
                    <EyeOff size={16} color={colors.inkPrimary} strokeWidth={2.5} />
                  ) : (
                    <Eye size={16} color={colors.inkPrimary} strokeWidth={2.5} />
                  )}
                </Pressable>
              </View>

              <Button
                title="CREATE ACCOUNT"
                variant="primary"
                size="lg"
                loading={loading}
                onPress={handleSignup}
                style={styles.submitBtn}
              />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Exploration Bypass */}
          <Button
            title="CONTINUE AS GUEST"
            variant="outline"
            size="md"
            onPress={handleGuest}
            style={styles.guestBtn}
          />

          {/* Switch to Login */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>ALREADY HAVE AN ACCOUNT? </Text>
            <Pressable onPress={() => router.push('/auth/login')}>
              <Text style={styles.footerLink}>SIGN IN</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </DottedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadows.hard,
  },
  brandTitle: {
    fontSize: 18,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 10,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 18,
    marginBottom: 16,
    ...shadows.hard,
  },
  errorBox: {
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    padding: 10,
    borderRadius: 2,
    marginBottom: 14,
  },
  errorText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  formContainer: {
    gap: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.creamLight,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    marginTop: 6,
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.borderPrimary,
  },
  dividerText: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkSecondary,
    letterSpacing: 1,
  },
  guestBtn: {
    width: '100%',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
  },
  footerLink: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.pixelBlue,
    textDecorationLine: 'underline',
  },
});
