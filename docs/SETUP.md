<p align="center">
  <img src="../assets/branding/camassis-logo.svg" alt="CamAssis Logo" width="180" />
</p>

# CamAssis Developer Setup & Local Environment Guide

## Prerequisites

1. **Node.js**: v20 or later (v22 recommended).
2. **Git**: Installed and configured.
3. **Expo Go or Development Build**:
   - iOS: Expo Go (App Store) or Xcode 16+ on macOS.
   - Android: Expo Go (Play Store) or Android Studio with Android SDK 35+.
4. **Supabase Account**: (Optional for local development, required for cloud synchronization).

---

## Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository_url> CamAssis
   cd CamAssis
   ```

2. **Install Dependencies**:
   Always install Expo-compatible dependencies:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(Note: If left empty, CamAssis runs in full offline mock mode with bundled categories, collections, and poses).*

4. **Verify Dependencies & Project Health**:
   ```bash
   npx expo-doctor
   npx tsc --noEmit
   npm test
   npx expo lint
   ```

---

## Supabase Database Setup

1. Open your Supabase Project Dashboard -> **SQL Editor**.
2. Run the initial migration:
   - Copy contents of `supabase/migrations/20260218_camassis_init.sql` and click **Run**.
3. Run the account deletion RPC migration:
   - Copy contents of `supabase/migrations/20260219_account_deletion.sql` and click **Run**.
4. Seed categories, collections, poses, and MediaPipe landmarks:
   - Copy contents of `supabase/seed.sql` and click **Run**.

---

## Running the Application

### Development Server
```bash
npx expo start
```

### Run on Android
```bash
npx expo run:android   # For custom native dev build
# OR
npx expo start --android
```

### Run on iOS
```bash
npx expo run:ios       # For custom native dev build
# OR
npx expo start --ios
```

### Run on Web
```bash
npx expo start --web
```
