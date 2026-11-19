import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Key sanitization: SecureStore accepts only alphanumeric, '.', '-', and '_'
 */
function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * SecureStorageAdapter
 *
 * Implements Supabase's SupportedStorage interface.
 * - On iOS/Android native: Uses encrypted iOS Keychain and Android Keystore via expo-secure-store.
 * - On Web: Falls back gracefully to AsyncStorage.
 */
export const SecureStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return await AsyncStorage.getItem(key);
      } catch {
        return null;
      }
    }

    try {
      const sanitized = sanitizeKey(key);
      return await SecureStore.getItemAsync(sanitized);
    } catch (e) {
      console.warn('SecureStore.getItemAsync error, fallback to AsyncStorage:', e);
      return await AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        console.warn('AsyncStorage.setItem error on web:', e);
      }
      return;
    }

    try {
      const sanitized = sanitizeKey(key);
      await SecureStore.setItemAsync(sanitized, value, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      });
    } catch (e) {
      console.warn('SecureStore.setItemAsync error, fallback to AsyncStorage:', e);
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        await AsyncStorage.removeItem(key);
      } catch (e) {
        console.warn('AsyncStorage.removeItem error on web:', e);
      }
      return;
    }

    try {
      const sanitized = sanitizeKey(key);
      await SecureStore.deleteItemAsync(sanitized);
    } catch (e) {
      console.warn('SecureStore.deleteItemAsync error:', e);
    }

    // Also clean up any legacy AsyncStorage entry with this key
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};
