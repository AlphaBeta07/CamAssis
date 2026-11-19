import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Mail, Lightbulb } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'WHAT IS THE GHOST POSE CAMERA?',
    a: 'Ghost Pose Camera overlays a semi-transparent reference photo or skeletal outline on your live camera preview so you can position your body and limbs to recreate aesthetic photography poses.',
  },
  {
    q: 'WILL THE TRANSPARENT OVERLAY APPEAR IN MY CAPTURED PHOTO?',
    a: 'Never. The overlay is strictly an on-screen preview guide. Your camera captures pristine, unedited photos through the native sensor directly into your photo gallery.',
  },
  {
    q: 'HOW DOES ON-DEVICE AI POSE COACHING WORK?',
    a: 'Using 33 anatomical landmarks, our on-device algorithm tracks joint angles (elbows, shoulders, hips, knees) and provides instant directional feedback until your alignment turns green.',
  },
  {
    q: 'WHERE ARE MY PHOTOS SAVED?',
    a: 'Every photo is automatically saved directly to your native Gallery (Android) or Photos app (iOS) in the "CamAssis" album. No manual saving required.',
  },
  {
    q: 'CAN I USE CAMASSIS OFFLINE?',
    a: 'Yes! The entire pose library, Ghost Pose camera, and AI pose matching algorithms are completely functional offline without an internet connection.',
  },
];

export default function HelpScreen() {
  const handleContact = () => {
    Linking.openURL('mailto:support@camassis.app?subject=CamAssis%20Feedback');
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
            <Text style={styles.headerTitle}>HELP & MANUAL</Text>
            <Text style={styles.headerSubtitle}>TIPS & FREQUENT QUESTIONS</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Photography Pro Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeaderRow}>
              <View style={styles.tipIconBox}>
                <Lightbulb size={16} color={colors.inkPrimary} strokeWidth={2.5} />
              </View>
              <Text style={styles.tipsTitle}>PHOTOGRAPHY RULES</Text>
            </View>
            <Text style={styles.tipText}>• <Text style={styles.bold}>Rule of Thirds:</Text> Enable the 3x3 grid to place your eyes along the top-third horizontal line.</Text>
            <Text style={styles.tipText}>• <Text style={styles.bold}>Weight Shift:</Text> For full-body poses, resting 80% weight on your back leg elongates your silhouette.</Text>
            <Text style={styles.tipText}>• <Text style={styles.bold}>Golden Hour:</Text> Shoot 1 hour after sunrise or before sunset for warm, natural skin tones.</Text>
          </View>

          {/* FAQs */}
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          {FAQS.map((faq, idx) => (
            <View key={idx} style={styles.faqCard}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={styles.faqA}>{faq.a}</Text>
            </View>
          ))}

          {/* Contact Support */}
          <View style={styles.contactCard}>
            <View style={styles.contactIconBox}>
              <Mail size={22} color={colors.inkPrimary} strokeWidth={2.5} />
            </View>
            <Text style={styles.contactTitle}>NEED FURTHER ASSISTANCE?</Text>
            <Text style={styles.contactDesc}>
              Have suggestions for new pose categories or need help with permissions?
            </Text>
            <Button
              title="CONTACT SUPPORT"
              variant="primary"
              size="md"
              onPress={handleContact}
              style={styles.contactBtn}
            />
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
  tipsCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 16,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  tipIconBox: {
    width: 30,
    height: 30,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  tipsTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.2,
  },
  tipText: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  bold: {
    fontFamily: fonts.monoBold,
    color: colors.pixelGreen,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 10,
    ...shadows.hard,
  },
  faqQ: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  faqA: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 17,
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginTop: 10,
    ...shadows.hard,
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...shadows.hardXs,
  },
  contactTitle: {
    fontSize: 12,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 6,
  },
  contactDesc: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  contactBtn: {
    minWidth: 160,
  },
});
