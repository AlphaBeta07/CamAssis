import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, fonts, shadows } from '../../theme';
import { triggerHaptic } from '../../services/haptics/haptics';

export interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'orange' | 'green' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pixelFont?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  pixelFont = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (disabled || loading) return;
    triggerHaptic('impactMedium');
    onPress?.();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.pixelYellow,
          border: colors.borderPrimary,
          text: colors.inkPrimary,
        };
      case 'secondary':
        return {
          bg: colors.pixelBlue,
          border: colors.borderPrimary,
          text: colors.white,
        };
      case 'orange':
        return {
          bg: colors.pixelOrange,
          border: colors.borderPrimary,
          text: colors.white,
        };
      case 'green':
        return {
          bg: colors.pixelGreen,
          border: colors.borderPrimary,
          text: colors.white,
        };
      case 'outline':
        return {
          bg: colors.white,
          border: colors.borderPrimary,
          text: colors.inkPrimary,
        };
      case 'glass':
        return {
          bg: 'rgba(48, 37, 29, 0.85)',
          border: colors.pixelYellow,
          text: colors.white,
        };
      case 'ghost':
      default:
        return {
          bg: 'transparent',
          border: 'transparent',
          text: colors.inkPrimary,
        };
    }
  };

  const currentVariant = getVariantStyles();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 7,
          paddingHorizontal: 12,
          fontSize: 12,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 16,
        };
      case 'md':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 18,
          fontSize: 14,
        };
    }
  };

  const currentSize = getSizeStyles();
  const hasShadow = variant !== 'ghost';

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.base,
        hasShadow && styles.hardShadow,
        {
          backgroundColor: currentVariant.bg,
          borderColor: currentVariant.border,
          borderWidth: variant === 'ghost' ? 0 : 2,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          transform: isPressed ? [{ translateX: 2 }, { translateY: 2 }] : [{ translateX: 0 }, { translateY: 0 }],
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.text} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.textBase,
              {
                color: currentVariant.text,
                fontSize: currentSize.fontSize,
                fontFamily: pixelFont ? fonts.pixel : fonts.monoBold,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardShadow: {
    ...shadows.hard,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  textBase: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.45,
  },
});
