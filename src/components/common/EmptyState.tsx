import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from './Button';
import { colors, fonts, shadows } from '../../theme';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          variant="primary"
          onPress={onAction}
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    ...shadows.hard,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.hardXs,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  actionBtn: {
    minWidth: 160,
  },
});
