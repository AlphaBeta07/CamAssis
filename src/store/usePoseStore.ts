import { create } from 'zustand';
import { Pose } from '../types';
import { MOCK_POSES } from '../constants/mockData';
import { getFavoritePoseIds, toggleFavoritePose } from '../services/supabase/api';

interface PoseState {
  selectedPose: Pose | null;
  favorites: string[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  setSelectedPose: (pose: Pose | null) => void;
  loadFavorites: (userId?: string) => Promise<void>;
  toggleFavorite: (poseId: string, userId?: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedDifficulty: (difficulty: string | null) => void;
}

export const usePoseStore = create<PoseState>((set, get) => ({
  selectedPose: MOCK_POSES[1], // Default to "Hat Lean" so camera has immediate guidance if opened directly
  favorites: ['a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002'],
  searchQuery: '',
  selectedCategory: null,
  selectedDifficulty: null,

  setSelectedPose: (pose) => set({ selectedPose: pose }),

  loadFavorites: async (userId) => {
    try {
      const favs = await getFavoritePoseIds(userId);
      set({ favorites: favs });
    } catch {
      // ignore
    }
  },

  toggleFavorite: async (poseId, userId) => {
    const isFav = get().favorites.includes(poseId);
    const updated = isFav
      ? get().favorites.filter(id => id !== poseId)
      : [...get().favorites, poseId];

    set({ favorites: updated });
    await toggleFavoritePose(poseId, userId);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
}));
