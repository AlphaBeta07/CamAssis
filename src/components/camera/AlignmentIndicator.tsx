import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Sparkles, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { AIAlignmentResult } from '../../types';
import { colors, fonts, shadows } from '../../theme';

interface AlignmentIndicatorProps {
  alignmentResult: AIAlignmentResult;
  onPressDetails?: () => void;
  hasLandmarks: boolean;
}

export const AlignmentIndicator: React.FC<AlignmentIndicatorProps> = ({
  alignmentResult,
  onPressDetails,
  hasLandmarks,
}) => {
  if (!hasLandmarks) {
    return (
      <View style={styles.container}>
        <View style={styles.disabledBadge}>
          <Sparkles size={12} color={colors.inkSecondary} strokeWidth={2.5} />
          <Text style={styles.disabledText}>AI GUIDANCE UNAVAILABLE FOR THIS POSE</Text>
        </View>
      </View>
    );
  }

  const { status, similarityScore, primaryFeedback } = alignmentResult;

  let statusBg = colors.error;
  let statusTextColor = colors.white;
  let statusIcon = <AlertCircle size={13} color={colors.white} strokeWidth={2.5} />;

  if (status === 'Great Match') {
    statusBg = colors.pixelGreen;
    statusTextColor = colors.white;
    statusIcon = <CheckCircle2 size={13} color={colors.white} strokeWidth={2.5} />;
  } else if (status === 'Getting Closer') {
    statusBg = colors.pixelYellow;
    statusTextColor = colors.inkPrimary;
    statusIcon = <Sparkles size={13} color={colors.inkPrimary} strokeWidth={2.5} />;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.pressed,
        ]}
        onPress={onPressDetails}
      >
        <View style={styles.headerRow}>
          <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
            {statusIcon}
            <Text style={[styles.statusText, { color: statusTextColor }]}>
              {status.toUpperCase()}
            </Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scoreNumber}>{similarityScore}%</Text>
            <Text style={styles.scoreLabel}>MATCH</Text>
          </View>
        </View>

        <View style={styles.bodyRow}>
          <Text style={styles.feedbackText} numberOfLines={2}>
            {primaryFeedback.toUpperCase()}
          </Text>
          {onPressDetails && (
            <View style={styles.detailChevron}>
              <ChevronRight size={16} color={colors.inkPrimary} strokeWidth={2.5} />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    maxWidth: 380,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    ...shadows.hardXs,
  },
  statusText: {
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreNumber: {
    color: colors.inkPrimary,
    fontSize: 14,
    fontFamily: fonts.monoBold,
  },
  scoreLabel: {
    color: colors.inkSecondary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackText: {
    color: colors.inkPrimary,
    fontSize: 11,
    fontFamily: fonts.mono,
    flex: 1,
    lineHeight: 16,
  },
  detailChevron: {
    marginLeft: 8,
  },
  disabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    ...shadows.hardXs,
  },
  disabledText: {
    color: colors.inkSecondary,
    fontSize: 9,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
});
