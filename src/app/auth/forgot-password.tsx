import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.includes('@')) {
      triggerHaptic('error');
      return;
    }

    setLoading(true);
    triggerHaptic('impactLight');
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      triggerHaptic('success');
    }, 800);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <View style={styles.content}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>

          <Text style={styles.title}>RESET PASSWORD</Text>
          <Text style={styles.subtitle}>
            ENTER YOUR ACCOUNT EMAIL AND WE'LL SEND RECOVERY INSTRUCTIONS.
          </Text>

          {sent ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={28} color={colors.pixelGreen} strokeWidth={2.5} />
              <Text style={styles.successTitle}>INSTRUCTIONS SENT</Text>
              <Text style={styles.successDesc}>
                If an account exists for {email}, recovery instructions have been sent.
              </Text>
              <Button
                title="BACK TO SIGN IN"
                variant="primary"
                size="md"
                onPress={() => router.replace('/auth/login')}
                style={styles.backToLoginBtn}
              />
            </View>
          ) : (
            <View style={styles.formCard}>
              <View style={styles.inputWrap}>
                <Mail size={16} color={colors.inkPrimary} style={styles.inputIcon} strokeWidth={2.5} />
                <TextInput
                  style={styles.textInput}
                  placeholder="EMAIL ADDRESS"
                  placeholderTextColor={colors.inkSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  autoFocus
                />
              </View>

              <Button
                title="SEND RECOVERY EMAIL"
                variant="primary"
                size="lg"
                loading={loading}
                onPress={handleReset}
                style={styles.submitBtn}
              />
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...shadows.hardXs,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: fonts.monoMedium,
    color: colors.pixelGreen,
    letterSpacing: 0.5,
    lineHeight: 16,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 16,
    ...shadows.hard,
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
    marginBottom: 16,
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
  submitBtn: {
    width: '100%',
  },
  successBox: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 24,
    alignItems: 'center',
    ...shadows.hard,
  },
  successTitle: {
    fontSize: 14,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  backToLoginBtn: {
    width: '100%',
  },
});
