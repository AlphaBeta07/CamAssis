import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const triggerHaptic = async (
  type: 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' | 'success' | 'warning' | 'error',
  enabled: boolean = true
) => {
  if (!enabled || Platform.OS === 'web') return;

  try {
    switch (type) {
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'impactLight':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'impactMedium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'impactHeavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    // Graceful fallback if haptics is unsupported on device
  }
};
