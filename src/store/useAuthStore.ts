import { create } from 'zustand';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase/client';
import { SecureStorageAdapter } from '../services/supabase/secureStorage';

const USER_STORAGE_KEY = 'camassis_user_profile';
const ONBOARDING_COMPLETED_KEY = '@camassis_onboarded';

interface AuthState {
  user: UserProfile | null;
  isGuest: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isGuest: true,
  isOnboarded: false,
  isLoading: true,

  initialize: async () => {
    try {
      const onboarded = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);

      // Check live Supabase session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
          if (!sessionErr && sessionData?.session?.user) {
            const u = sessionData.session.user;
            const profile: UserProfile = {
              id: u.id,
              email: u.email || '',
              full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Photographer',
              isGuest: false,
            };
            await SecureStorageAdapter.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
            set({
              user: profile,
              isGuest: false,
              isOnboarded: Boolean(onboarded),
              isLoading: false,
            });
            return;
          }
        } catch (e) {
          console.warn('Supabase session check error, falling back to secure store:', e);
        }
      }

      // Fallback: Check cached credentials in secure storage
      const storedUser = await SecureStorageAdapter.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          set({
            user: parsed,
            isGuest: Boolean(parsed.isGuest),
            isOnboarded: Boolean(onboarded),
            isLoading: false,
          });
          return;
        } catch {
          // parse error
        }
      }

      // Default Guest session
      const guestProfile: UserProfile = {
        id: 'guest-user',
        full_name: 'Guest Explorer',
        email: '',
        isGuest: true,
      };
      set({
        user: guestProfile,
        isGuest: true,
        isOnboarded: Boolean(onboarded),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    set({ isOnboarded: true });
  },

  continueAsGuest: async () => {
    const guestUser: UserProfile = {
      id: 'guest-user',
      full_name: 'Guest Explorer',
      email: '',
      isGuest: true,
    };
    await SecureStorageAdapter.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    set({ user: guestUser, isGuest: true });
  },

  login: async (email: string, pass: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            isGuest: false,
          };
          await SecureStorageAdapter.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
          set({ user: profile, isGuest: false });
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        return { success: false, error: msg };
      }
    }

    // Offline / Mock auth for development
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    const mockUser: UserProfile = {
      id: `user-${Date.now()}`,
      full_name: email.split('@')[0],
      email: email,
      isGuest: false,
    };
    await SecureStorageAdapter.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
    set({ user: mockUser, isGuest: false });
    return { success: true };
  },

  signup: async (email: string, pass: string, fullName: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: fullName } },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            isGuest: false,
          };
          await SecureStorageAdapter.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
          set({ user: profile, isGuest: false });
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Signup failed';
        return { success: false, error: msg };
      }
    }

    // Offline / Mock signup
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      full_name: fullName || email.split('@')[0],
      email: email,
      isGuest: false,
    };
    await SecureStorageAdapter.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    set({ user: newUser, isGuest: false });
    return { success: true };
  },

  logout: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    await SecureStorageAdapter.removeItem(USER_STORAGE_KEY);
    const guestUser: UserProfile = {
      id: 'guest-user',
      full_name: 'Guest Explorer',
      email: '',
      isGuest: true,
    };
    set({ user: guestUser, isGuest: true });
  },

  deleteAccount: async () => {
    const currentUser = get().user;
    if (!currentUser || currentUser.isGuest) {
      await get().logout();
      return { success: true };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.rpc('delete_user_account');
        if (error) {
          console.warn('Backend delete_user_account rpc error, proceeding with local clean up:', error);
        }
        await supabase.auth.signOut();
      } catch (err: unknown) {
        console.warn('Supabase delete account error:', err);
      }
    }

    await SecureStorageAdapter.removeItem(USER_STORAGE_KEY);
    const guestUser: UserProfile = {
      id: 'guest-user',
      full_name: 'Guest Explorer',
      email: '',
      isGuest: true,
    };
    set({ user: guestUser, isGuest: true });
    return { success: true };
  },
}));
