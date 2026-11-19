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
import { router } from 'expo-router';
import { X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { DottedBackground } from '../../components/common/DottedBackground';
import { colors, fonts, shadows } from '../../theme';
import { usePoseStore } from '../../store/usePoseStore';
import { triggerHaptic } from '../../services/haptics/haptics';

export default function CameraFeedbackModal() {
  const { selectedPose } = usePoseStore();

  const handleClose = () => {
    triggerHaptic('impactLight');
    router.back();
  };

  const joints = [
    { name: 'HEAD & NECK TILT', status: 'ALIGNED', current: '12°', target: '10°', diff: '2°' },
    { name: 'LEFT SHOULDER SLOPE', status: 'ALIGNED', current: '174°', target: '170°', diff: '4°' },
    { name: 'RIGHT SHOULDER SLOPE', status: 'ALIGNED', current: '168°', target: '165°', diff: '3°' },
    { name: 'LEFT ELBOW ANGLE', status: 'ADJUST', current: '110°', target: '95°', diff: '15°' },
    { name: 'RIGHT ELBOW ANGLE', status: 'ALIGNED', current: '62°', target: '60°', diff: '2°' },
    { name: 'HIP & WEIGHT SHIFT', status: 'ALIGNED', current: '88°', target: '90°', diff: '2°' },
    { name: 'LEFT KNEE FLEXION', status: 'ADJUST', current: '165°', target: '150°', diff: '15°' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar style="dark" hidden={false} />
      <DottedBackground>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Sparkles size={18} color={colors.pixelGreen} strokeWidth={2.5} />
            <Text style={styles.headerTitle}>AI ALIGNMENT REPORT</Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <X size={18} color={colors.inkPrimary} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Score Overview Card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreValue}>82%</Text>
              <Text style={styles.scoreLabel}>MATCH</Text>
            </View>
            <View style={styles.scoreTextCol}>
              <Text style={styles.scoreTitle}>GREAT ALIGNMENT</Text>
              <Text style={styles.scoreDesc}>
                Your posture closely matches <Text style={styles.bold}>{selectedPose?.title.toUpperCase() || 'TARGET POSE'}</Text>. Only minor arm angles need tweaking.
              </Text>
            </View>
          </View>

          {/* Actionable Suggestions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>REAL-TIME COACHING CUES</Text>

            <View style={styles.adviceItem}>
              <CheckCircle2 size={16} color={colors.pixelGreen} strokeWidth={2.5} />
              <Text style={styles.adviceText}>Torso center and head angle are perfectly positioned.</Text>
            </View>

            <View style={styles.adviceItem}>
              <AlertCircle size={16} color={colors.pixelOrange} strokeWidth={2.5} />
              <Text style={styles.adviceText}>Bend your left elbow slightly more toward chest height.</Text>
            </View>

            <View style={styles.adviceItem}>
              <AlertCircle size={16} color={colors.pixelOrange} strokeWidth={2.5} />
              <Text style={styles.adviceText}>Relax your knees and shift weight slightly to your back leg.</Text>
            </View>
          </View>

          {/* Joint Geometry Breakdown Table */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>33-LANDMARK GEOMETRY</Text>

            <View style={styles.tableHeader}>
              <Text style={[styles.colHeader, { flex: 2 }]}>JOINT</Text>
              <Text style={styles.colHeader}>ACTUAL</Text>
              <Text style={styles.colHeader}>GOAL</Text>
              <Text style={[styles.colHeader, { textAlign: 'right' }]}>STATUS</Text>
            </View>

            {joints.map((j, i) => {
              const isGood = j.status === 'ALIGNED';
              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.jointName, { flex: 2 }]}>{j.name}</Text>
                  <Text style={styles.jointVal}>{j.current}</Text>
                  <Text style={styles.jointVal}>{j.target}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: isGood ? colors.pixelGreen : colors.pixelYellow },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: isGood ? colors.white : colors.inkPrimary },
                      ]}
                    >
                      {j.status}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Button
            title="RETURN TO CAMERA"
            variant="primary"
            size="lg"
            onPress={handleClose}
            style={styles.doneBtn}
          />
        </ScrollView>
      </DottedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: colors.cream,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.hardXs,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    marginBottom: 16,
    ...shadows.hard,
  },
  scoreBox: {
    width: 66,
    height: 66,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    ...shadows.hardXs,
  },
  scoreValue: {
    fontSize: 18,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  scoreLabel: {
    fontSize: 8,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
  scoreTextCol: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 12,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 4,
  },
  scoreDesc: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    lineHeight: 16,
  },
  bold: {
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    padding: 14,
    marginBottom: 16,
    ...shadows.hard,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  adviceText: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.inkPrimary,
    flex: 1,
    lineHeight: 17,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderPrimary,
    marginBottom: 8,
  },
  colHeader: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    color: colors.inkSecondary,
    flex: 1,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
  },
  jointName: {
    fontSize: 10,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
  },
  jointVal: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    flex: 1,
  },
  statusPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  statusPillText: {
    fontSize: 8,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.4,
  },
  doneBtn: {
    marginTop: 4,
    width: '100%',
  },
});
