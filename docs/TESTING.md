<p align="center">
  <img src="../assets/branding/camassis-logo.svg" alt="CamAssis Logo" width="180" />
</p>

# CamAssis Testing Protocol & Quality Assurance Report

## 1. Automated Test Execution

CamAssis includes automated unit and integration tests executing on the high-performance native test runner:

```bash
npm test
```

### Verified Test Suites:
- **`test/ai-normalization.test.mjs`**:
  - Bounding box calculation across diverse aspect ratios.
  - Scale and translation invariance using torso center coordinates.
  - Front-camera selfie mirroring with horizontal coordinate inversion.
- **`test/ai-pose-comparator.test.mjs`**:
  - Exact angular calculations (acute $45^\circ$, right $90^\circ$, obtuse $180^\circ$).
  - Multi-joint angular deviation tolerances ($25^\circ - 30^\circ$).
  - Congruent pose similarity consistency.
- **`test/error-handler.test.mjs`**:
  - Automatic JWT/token redaction from error strings.
  - URL masking for private backend endpoints.
  - Null/undefined input safety.
- **`test/data-integrity.test.mjs`**:
  - RFC4122 hexadecimal UUID validation across all database seed rows.
  - Full catalog verification: Categories, Collections, Poses, and MediaPipe Landmarks.
  - 33-point MediaPipe landmark boundary enforcement ($[0.0, 1.0]$ coordinate validation).

---

## 2. Quality Gates Check Commands

| Gate | Command | Status |
| :--- | :--- | :--- |
| **TypeScript Validation** | `npx tsc --noEmit` | **PASS (0 errors)** |
| **Linting & Code Quality** | `npx expo lint` | **PASS (0 warnings, 0 errors)** |
| **Dependency & Config Health** | `npx expo-doctor` | **PASS (20/20 checks passed)** |
| **Automated Unit Tests** | `npm test` | **PASS (13/13 tests passed)** |

---

## 3. Real Device Verification Protocol

### Camera Hardware & Viewport:
1. **Status Bar Visibility**: Native status bar (time, battery, Wi-Fi) is clearly visible on every screen.
2. **Safe Area Spacing**: Camera controls and headers never overlap device notches, Dynamic Island, or pill camera cutouts.
3. **Capture Cleanliness**: Capture produces a clean, high-resolution original photograph directly into the gallery without transparent overlays, skeletal outlines, or UI artifacts.
4. **Offline Capability**: Camera, overlay guides, and local pose catalog function seamlessly in Airplane Mode.
