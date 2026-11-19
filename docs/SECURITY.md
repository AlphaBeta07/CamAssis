<p align="center">
  <img src="../assets/branding/camassis-logo.svg" alt="CamAssis Logo" width="180" />
</p>

# CamAssis Security & Privacy Policy Specification

## 1. Core Principles

1. **Zero Cloud Photo Upload**: Captured photographs and user-selected custom pose images are processed exclusively on the client device. CamAssis has no backend storage bucket for photos.
2. **Encrypted Token Storage**: All authentication credentials, session tokens, and refresh tokens are stored in platform hardware security enclaves via `expo-secure-store` (iOS Keychain / Android Keystore).
3. **No Private API Keys in Client Bundles**: Only public anonymous keys (`EXPO_PUBLIC_SUPABASE_ANON_KEY`) are bundled. The Supabase `service_role` key is strictly forbidden from client builds.
4. **Row Level Security (RLS)**: Enforced in PostgreSQL across all tables.

---

## 2. Row Level Security (RLS) Policy Matrix

| Table | Policy Name | Permitted Operation | Using Clause |
| :--- | :--- | :--- | :--- |
| `categories` | Public can view published categories | `SELECT` | `true` |
| `collections` | Public can view collections | `SELECT` | `true` |
| `poses` | Public can view published poses | `SELECT` | `is_published = true` |
| `pose_landmarks` | Public can view validated landmarks | `SELECT` | `is_validated = true` |
| `profiles` | Users can view and edit own profile | `ALL` | `auth.uid() = id` |
| `favorites` | Users can manage own favorites | `ALL` | `auth.uid() = user_id` |
| `user_settings` | Users can manage own settings | `ALL` | `auth.uid() = user_id` |
| `photo_sessions` | Users can insert own session stats | `INSERT`, `SELECT` | `auth.uid() = user_id` |
| `pose_attempts` | Users can insert own AI attempts | `INSERT`, `SELECT` | `auth.uid() = user_id` |
| `reports` | Users can insert content reports | `INSERT` | `true` |

---

## 3. Account Deletion Workflow (App Store Guideline 5.1.1(v))

When an authenticated user requests account deletion from **Profile -> Delete Account**:
1. An explicit, high-friction confirmation dialog warns the user of permanent data deletion.
2. The client invokes PostgreSQL function `public.delete_user_account()`.
3. The function executes with `SECURITY DEFINER`:
   - Deletes all user favorites, settings, attempt records, and profile rows.
   - Deletes the identity from `auth.users`.
4. Client signs out of Supabase session.
5. Clears hardware Keychain / Keystore and resets client to Guest mode.
6. The user's device photo gallery remains completely untouched.

---

## 4. Disaster Recovery & Database Backup Strategy

- **Automated Backups**: Enable Supabase Daily Backups (or physical WAL-G backup on custom instances).
- **Point-in-Time Recovery (PITR)**: Recommended for production projects to allow rollback to any second in the past 7 days.
- **Reproducible Migration Chain**:
  - `supabase/migrations/20260218_camassis_init.sql` (Schema & RLS)
  - `supabase/migrations/20260219_account_deletion.sql` (Deletion RPC)
  - `supabase/seed.sql` (Curated catalog data)
