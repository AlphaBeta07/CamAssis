import { supabase, isSupabaseConfigured } from './client';
import { Category, Collection, Pose, UserSettings } from '../../types';
import { MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_POSES } from '../../constants/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@camassis_favorites';
const SETTINGS_STORAGE_KEY = '@camassis_settings';

export interface PoseFilters {
  categoryId?: string;
  collectionId?: string;
  difficulty?: string;
  searchQuery?: string;
  bodyFraming?: string;
}

// 1. Categories
export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase fetchCategories error, falling back to local dataset:', e);
    }
  }
  return MOCK_CATEGORIES;
}

// 2. Collections
export async function fetchCollections(): Promise<Collection[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Collection[];
      }
    } catch (e) {
      console.warn('Supabase fetchCollections error, falling back to local dataset:', e);
    }
  }
  return MOCK_COLLECTIONS;
}

// 3. Poses with search and filtering
export async function fetchPoses(filters?: PoseFilters): Promise<Pose[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('poses')
        .select('*, pose_landmarks(landmark_data)')
        .eq('is_published', true);

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.collectionId) {
        query = query.eq('collection_id', filters.collectionId);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.bodyFraming) {
        query = query.eq('body_framing', filters.bodyFraming);
      }
      if (filters?.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item,
          has_landmarks: Boolean(item.pose_landmarks && item.pose_landmarks.length > 0),
          landmarks: item.pose_landmarks?.[0]?.landmark_data || undefined,
        })) as Pose[];
      }
    } catch (e) {
      console.warn('Supabase fetchPoses error, falling back to local dataset:', e);
    }
  }

  // Local fallback with full filtering logic
  let result = [...MOCK_POSES];

  if (filters?.categoryId) {
    result = result.filter(p => p.category_id === filters.categoryId);
  }
  if (filters?.collectionId) {
    result = result.filter(p => p.collection_id === filters.collectionId);
  }
  if (filters?.difficulty) {
    result = result.filter(p => p.difficulty === filters.difficulty);
  }
  if (filters?.bodyFraming) {
    result = result.filter(p => p.body_framing === filters.bodyFraming);
  }
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.collection_name?.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return result;
}

// 4. Pose by ID
export async function fetchPoseById(id: string): Promise<Pose | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('poses')
        .select('*, pose_landmarks(landmark_data)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          ...data,
          has_landmarks: Boolean(data.pose_landmarks && data.pose_landmarks.length > 0),
          landmarks: data.pose_landmarks?.[0]?.landmark_data || undefined,
        } as Pose;
      }
    } catch (e) {
      console.warn('Supabase fetchPoseById error, falling back to local dataset:', e);
    }
  }

  const found = MOCK_POSES.find(p => p.id === id || p.slug === id);
  return found || null;
}

// 5. Pose of the Day
export async function fetchPoseOfTheDay(): Promise<Pose> {
  const dayIndex = new Date().getDate() % MOCK_POSES.length;
  return MOCK_POSES[dayIndex] || MOCK_POSES[0];
}

// 6. Favorites
export async function getFavoritePoseIds(userId?: string): Promise<string[]> {
  if (userId && isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('pose_id')
        .eq('user_id', userId);

      if (!error && data) {
        return data.map(item => item.pose_id);
      }
    } catch (e) {
      console.warn('Supabase getFavoritePoseIds error:', e);
    }
  }

  // Local storage fallback for guest or offline
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002'];
  } catch {
    return [];
  }
}

export async function toggleFavoritePose(poseId: string, userId?: string): Promise<boolean> {
  const current = await getFavoritePoseIds(userId);
  const isFav = current.includes(poseId);
  const nextFavs = isFav ? current.filter(id => id !== poseId) : [...current, poseId];

  // Save locally
  await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavs));

  // Sync to Supabase if logged in
  if (userId && isSupabaseConfigured && supabase) {
    try {
      if (isFav) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('pose_id', poseId);
      } else {
        await supabase.from('favorites').insert({ user_id: userId, pose_id: poseId });
      }
    } catch (e) {
      console.warn('Supabase toggleFavorite error:', e);
    }
  }

  return !isFav;
}

// 7. Settings
const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  default_overlay_opacity: 0.4,
  default_overlay_mode: 'both',
  ai_pose_coach_enabled: true,
  haptics_enabled: true,
  show_grid_by_default: false,
};

export async function loadUserSettings(_userId?: string): Promise<UserSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export async function saveUserSettings(settings: Partial<UserSettings>, userId?: string): Promise<void> {
  try {
    const current = await loadUserSettings(userId);
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}
