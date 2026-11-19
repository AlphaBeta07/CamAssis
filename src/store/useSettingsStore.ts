import { create } from 'zustand';
import { UserSettings } from '../types';
import { loadUserSettings, saveUserSettings } from '../services/supabase/api';

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  initialize: (userId?: string) => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>, userId?: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    theme: 'light',
    default_overlay_opacity: 0.4,
    default_overlay_mode: 'both',
    ai_pose_coach_enabled: true,
    haptics_enabled: true,
    show_grid_by_default: false,
  },
  isLoading: true,

  initialize: async (userId) => {
    try {
      const s = await loadUserSettings(userId);
      set({ settings: s, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateSettings: async (partial, userId) => {
    const updated = { ...get().settings, ...partial };
    set({ settings: updated });
    await saveUserSettings(partial, userId);
  },
}));
