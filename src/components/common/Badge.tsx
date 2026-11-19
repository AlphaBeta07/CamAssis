import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import { colors, fonts, shadows } from '../../theme';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'yellow' | 'orange' | 'blue' | 'green' | 'soft' | 'outline' | 'success' | 'warning' | 'dark';
  icon?: React.ReactNode;
  pixel?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'yellow',
  icon,
  pixel = false,
  style,
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'primary':
      case 'yellow':
        return { bg: colors.pixelYellow, text: colors.inkPrimary, border: colors.borderPrimary };
      case 'orange':
        return { bg: colors.pixelOrange, text: colors.white, border: colors.borderPrimary };
      case 'blue':
        return { bg: colors.pixelBlue, text: colors.white, border: colors.borderPrimary };
      case 'green':
      case 'success':
        return { bg: colors.pixelGreen, text: colors.white, border: colors.borderPrimary };
      case 'warning':
        return { bg: colors.pixelYellow, text: colors.inkPrimary, border: colors.borderPrimary };
      case 'dark':
        return { bg: colors.borderPrimary, text: colors.white, border: colors.borderPrimary };
      case 'outline':
        return { bg: colors.white, text: colors.inkPrimary, border: colors.borderPrimary };
      case 'soft':
      default:
        return { bg: colors.creamLight, text: colors.inkPrimary, border: colors.borderPrimary };
    }
  };

  const themeStyle = getStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: themeStyle.bg,
          borderColor: themeStyle.border,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: themeStyle.text,
            fontFamily: pixel ? fonts.pixel : fonts.monoBold,
            fontSize: pixel ? 8 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1.5,
    ...shadows.hardXs,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
