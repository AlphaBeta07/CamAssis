import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomPose, Pose } from '../types';

const STORAGE_KEY = '@camassis_custom_poses';

interface CustomPoseState {
  customPoses: CustomPose[];
  isLoading: boolean;
  loadCustomPoses: () => Promise<void>;
  addCustomPose: (pose: CustomPose) => Promise<void>;
  deleteCustomPose: (id: string) => Promise<void>;
  renameCustomPose: (id: string, newTitle: string) => Promise<void>;
}

export function customPoseToStandardPose(custom: CustomPose): Pose {
  return {
    id: custom.id,
    title: custom.title,
    slug: custom.id,
    description: `Custom pose created from your gallery on ${new Date(custom.createdAt).toLocaleDateString()}`,
    category_id: 'custom',
    category_name: 'My Pose',
    reference_image_url: custom.imageUri,
    difficulty: 'Beginner',
    body_framing: custom.bodyFraming,
    camera_angle: custom.cameraAngle || 'Eye Level',
    lighting_tips: 'Match the lighting of your reference photograph for best results.',
    instructions: custom.instructions || [
      'Align your head and torso with the transparent ghost guide.',
      'Position your arms and hands to match the reference skeleton.',
      'Adjust your distance from the camera until the AI indicator turns green.',
    ],
    tags: ['custom', 'my-pose', 'personal'],
    is_featured: false,
    is_published: true,
    has_landmarks: true,
    landmarks: custom.landmarks,
    isCustom: true,
  };
}

export const useCustomPoseStore = create<CustomPoseState>((set, get) => ({
  customPoses: [],
  isLoading: true,

  loadCustomPoses: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ customPoses: JSON.parse(raw), isLoading: false });
        return;
      }
    } catch (e) {
      console.warn('Failed to load custom poses from storage:', e);
    }
    set({ customPoses: [], isLoading: false });
  },

  addCustomPose: async (pose: CustomPose) => {
    const nextList = [pose, ...get().customPoses.filter((p) => p.id !== pose.id)];
    set({ customPoses: nextList });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.warn('Failed to save custom pose:', e);
    }
  },

  deleteCustomPose: async (id: string) => {
    const nextList = get().customPoses.filter((p) => p.id !== id);
    set({ customPoses: nextList });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.warn('Failed to delete custom pose:', e);
    }
  },

  renameCustomPose: async (id: string, newTitle: string) => {
    const nextList = get().customPoses.map((p) => (p.id === id ? { ...p, title: newTitle } : p));
    set({ customPoses: nextList });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.warn('Failed to rename custom pose:', e);
    }
  },
}));
