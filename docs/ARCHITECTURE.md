<p align="center">
  <img src="../assets/branding/camassis-logo.svg" alt="CamAssis Logo" width="200" />
</p>

# CamAssis Architecture Specification

## 1. Executive Summary

**CamAssis** is an AI-powered camera and pose assistant mobile application built with React Native and Expo (SDK 58). It helps users discover, recreate, and capture aesthetic photography poses with real-time pose guidance, transparent overlays, and on-device AI alignment coaching.

---

## 2. Technical Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo / React Native | Expo 58 / RN 0.88 | Cross-platform mobile foundation |
| **Navigation** | Expo Router | 58.0.32 | File-system-based deep routing |
| **Language** | TypeScript | ~6.0.3 | Strict type safety across components & stores |
| **Camera** | Expo Camera (`CameraView`) | 58.0.14 | Live camera preview, flash, flip, zoom, picture capture |
| **Local Storage** | Expo SecureStore & AsyncStorage | 58.0.0 / 2.2.0 | Encrypted token storage & offline cache |
| **State Management** | Zustand | 5.1.0 | Lightweight reactive state stores |
| **Server State** | TanStack Query | 5.108.0 | Cache, query deduplication, background fetch |
| **Styling & Theme** | FlytBase Retro Brutalism | Custom | Cream (#E8E3CF), pixel display, JetBrains Mono |
| **AI Computer Vision** | MediaPipe 33 Landmark Engine | Custom on-device | Mathematical coordinate & joint angle comparator |
| **Backend / Database** | Supabase (PostgreSQL) | 2.119.0 client | Published pose catalog, categories, collections, auth |

---

## 3. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CamAssis Client (Mobile)                        │
├───────────────────┬───────────────────┬────────────────────────────────┤
│  Presentation     │  State / Service  │   Core Native Engines          │
│                   │                   │                                │
│ • Home Screen     │ • usePoseStore    │ • Expo CameraView              │
│ • Pose Library    │ • useCameraStore  │ • MediaLibrary (Photo Saver)   │
│ • Ghost Camera    │ • useCustomStore  │ • ImagePicker (Crop/Rotate)    │
│ • My Pose Creator │ • useAuthStore    │ • SecureStore (Encrypted Auth) │
│ • Profile & Stats │ • Supabase Client │ • MediaPipe Landmark Engine    │
└─────────┬─────────┴─────────┬─────────┴────────────────┬───────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌──────────────────┐ ┌──────────────────┐     ┌────────────────────────┐
│ Device Photos    │ │ Local AI Engine  │     │ Supabase Cloud         │
│ Native Gallery   │ │ (On-Device Only) │     │ (Metadata & Catalog)   │
│                  │ │                  │     │                        │
│ • Zero upload    │ │ • Normalization  │     │ • Categories           │
│ • Original raw   │ │ • Angle Calc     │     │ • Collections          │
│ • Album: CamAssis│ │ • Joint Scoring  │     │ • Curated Poses        │
└──────────────────┘ └──────────────────┘     │ • 33-pt Landmark Data  │
                                              │ • Strict RLS & Auth    │
                                              └────────────────────────┘
```

---

## 4. Subsystems Breakdown

### 4.1. Camera & Viewport Management
- **3-Tier Structured Layout**:
  1. `CameraTopBar`: Positioned strictly below the native system status bar. Contains close, lens flip, flash mode, 3x3 grid toggle, and AI coach toggle.
  2. `cameraViewport`: Fills the dynamic middle screen bounds (`flex: 1`, `overflow: 'hidden'`). Renders `CameraView`, `FramingGuideOverlay`, `CameraOverlay`, and `AlignmentIndicator`.
  3. `CameraBottomDeck`: Sits at the bottom of the screen. Houses the zoom selector (0.5X, 1X, 2X), overlay transparency slider (10% to 90%), overlay display mode switcher (Photo, Outline, Both), and primary shutter button.
- **Hardware Lifecycle**:
  - `AppState` listener pauses camera sensor rendering when the app is backgrounded or inactive, avoiding battery drain.
  - Automatically recovers and rebinds camera session upon foregrounding.

### 4.2. Photography Privacy & Storage Flow
- **Direct Native Saving**: When the user taps the shutter, `takePictureAsync` captures the original sensor image.
- **Zero Cloud Transfer**: Captured image bytes are written directly to device storage via `expo-media-library` and tagged into the native `"CamAssis"` album. No image pixels are ever sent over HTTP or uploaded to Supabase.
- **Cache Clean-Up**: Temporary raw capture files in the app cache directory are deleted immediately after native album insertion.

### 4.3. On-Device AI Pose Matching Pipeline
1. **Target Pose**: Loaded from Supabase or local offline cache with 33 normalized MediaPipe landmarks.
2. **User Pose Detection**: Extracted from camera frames or selected gallery photos.
3. **Normalization**:
   - Anchored on torso center (midpoint between shoulders and hips).
   - Scaled by torso length ($\text{dist}(\text{shoulders}, \text{hips})$) to make comparison invariant to camera distance.
   - Front-camera selfie mirroring handled by flipping horizontal axis ($x' = 1 - x$).
4. **Joint Angle Metric**:
   - Calculates 8 interior joint angles (Elbows, Shoulders, Hips, Knees).
   - Measures angular deviation against defined tolerance envelopes ($25^\circ - 30^\circ$).
5. **Combined Similarity Score**:
   $$\text{Score} = 0.55 \times \text{AngleScore} + 0.45 \times \text{DistanceScore}$$
6. **Real-time Feedback**: Categorizes posture into:
   - `Great Match` ($\ge 80\%$)
   - `Getting Closer` ($60\% - 79\%$)
   - `Needs Adjustment` ($< 60\%$)

---

## 5. Security & Authentication Architecture
- **Token Security**: Supabase JWTs, refresh tokens, and session credentials are encrypted in hardware-backed storage via `expo-secure-store` (iOS Keychain / Android Keystore).
- **Guest Access**: Users can fully explore poses, create custom guides, and shoot photos without signing up. Local favorites and custom poses are preserved in local storage.
- **Row Level Security (RLS)**: Public tables (`poses`, `categories`, `collections`, `pose_landmarks`) are read-only. Private tables (`profiles`, `favorites`, `user_settings`) require authenticated user ownership (`auth.uid() = user_id`).
- **Account Deletion**: Compliant with App Store Review Guideline 5.1.1(v) via Postgres RPC `delete_user_account()`.
