<p align="center">
  <img src="./assets/branding/camassis-logo.svg" alt="CamAssis Logo" width="180" />
</p>

# CamAssis CLI Commands & Operations

# 1. Start Development Server

### Start the Expo interactive development server (scans with Expo Go or dev client)
npx expo start
### Start and launch on Android emulator or connected device
npx expo start --android
### Start and launch on iOS simulator (macOS only)
npx expo start --ios
### Start web preview
npx expo start --web
### Start with cache cleared (useful if assets or configs were changed)
npx expo start -c

# 2. Testing & Quality Checks

### TypeScript strict typechecking (verified: 0 errors)
npx tsc --noEmit
### ESLint code verification (verified: 0 errors)
npx expo lint
### Expo Doctor configuration and dependency diagnostics (verified: 20/20 checks passed)
npx expo-doctor


# 3. Native Builds (EAS)

### Install EAS CLI globally (if not already installed)
npm install -g eas-cli
### Create a native development build for Android
npx eas-cli build --profile development --platform android
### Create a native development build for iOS
npx eas-cli build --profile development --platform ios
### Run locally on Android device/emulator with prebuild
npx expo run:android
### Run locally on iOS device/simulator with prebuild (macOS only)
npx expo run:ios

# 4. Building via EAS
### Build Android APK for test devices
npx eas-cli@latest build --platform android --profile preview

### Build Android App Bundle (AAB) for Google Play Store
npx eas-cli@latest build --platform android --profile production

### Build iOS for TestFlight / App Store submission
npx eas-cli@latest build --platform ios --profile production

