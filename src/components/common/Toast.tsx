import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';
import { colors, fonts, shadows } from '../../theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
}) => {
  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <View style={styles.floatingContainer} pointerEvents="none">
      <View
        style={[
          styles.toastBox,
          { backgroundColor: isSuccess ? colors.pixelGreen : colors.error },
        ]}
      >
        {isSuccess ? (
          <CheckCircle2 size={16} color={colors.white} strokeWidth={2.5} />
        ) : (
          <AlertCircle size={16} color={colors.white} strokeWidth={2.5} />
        )}
        <Text style={styles.messageText}>{message.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    ...shadows.hard,
  },
  messageText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fonts.monoBold,
    letterSpacing: 0.5,
  },
});
