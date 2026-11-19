import { create } from 'zustand';
import { OverlayMode, FramingGuide } from '../types';

interface CameraState {
  overlayMode: OverlayMode;
  overlayOpacity: number;
  showGuide: boolean;
  showGrid: boolean;
  framingGuide: FramingGuide;
  facing: 'back' | 'front';
  flash: 'off' | 'on' | 'auto';
  zoom: number; // 0 (1x), 0.5 (2x equivalent in Expo Camera), etc.
  isCapturing: boolean;
  saveToastVisible: boolean;
  saveToastMessage: string;
  lastCapturedUri: string | null;
  aiCoachEnabled: boolean;

  setOverlayMode: (mode: OverlayMode) => void;
  setOverlayOpacity: (opacity: number) => void;
  toggleGuide: () => void;
  toggleGrid: () => void;
  setFramingGuide: (guide: FramingGuide) => void;
  toggleFacing: () => void;
  toggleFlash: () => void;
  setZoom: (zoom: number) => void;
  setIsCapturing: (val: boolean) => void;
  showSaveToast: (msg: string) => void;
  hideSaveToast: () => void;
  setLastCapturedUri: (uri: string | null) => void;
  toggleAiCoach: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  overlayMode: 'both',
  overlayOpacity: 0.4,
  showGuide: true,
  showGrid: false,
  framingGuide: 'none',
  facing: 'back',
  flash: 'off',
  zoom: 0,
  isCapturing: false,
  saveToastVisible: false,
  saveToastMessage: '',
  lastCapturedUri: null,
  aiCoachEnabled: true,

  setOverlayMode: (mode) => set({ overlayMode: mode }),
  setOverlayOpacity: (opacity) => set({ overlayOpacity: Math.max(0.05, Math.min(1.0, opacity)) }),
  toggleGuide: () => set((state) => ({ showGuide: !state.showGuide })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setFramingGuide: (guide) => set({ framingGuide: guide }),
  toggleFacing: () => set((state) => ({ facing: state.facing === 'back' ? 'front' : 'back' })),
  toggleFlash: () =>
    set((state) => {
      const next = state.flash === 'off' ? 'on' : state.flash === 'on' ? 'auto' : 'off';
      return { flash: next };
    }),
  setZoom: (zoom) => set({ zoom }),
  setIsCapturing: (val) => set({ isCapturing: val }),
  showSaveToast: (msg) => {
    set({ saveToastVisible: true, saveToastMessage: msg });
    setTimeout(() => {
      set({ saveToastVisible: false });
    }, 2800);
  },
  hideSaveToast: () => set({ saveToastVisible: false }),
  setLastCapturedUri: (uri) => set({ lastCapturedUri: uri }),
  toggleAiCoach: () => set((state) => ({ aiCoachEnabled: !state.aiCoachEnabled })),
}));
