-- CamAssis Initial Database Migration
-- PostgreSQL schema for Supabase

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POSES
CREATE TABLE IF NOT EXISTS public.poses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  reference_image_url TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  body_framing TEXT NOT NULL CHECK (body_framing IN ('Full-Body', 'Upper-Body', 'Close-Up', 'Sitting')),
  camera_angle TEXT NOT NULL CHECK (camera_angle IN ('Eye Level', 'Low Angle', 'High Angle', 'Slight Low', 'Dutch Angle')),
  lighting_tips TEXT,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. POSE LANDMARKS (MediaPipe 33 Normalized Landmarks)
CREATE TABLE IF NOT EXISTS public.pose_landmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pose_id UUID REFERENCES public.poses(id) ON DELETE CASCADE UNIQUE,
  landmark_data JSONB NOT NULL,
  landmark_version TEXT DEFAULT 'mediapipe_v1',
  image_orientation TEXT DEFAULT 'portrait',
  is_validated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  pose_id UUID REFERENCES public.poses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pose_id)
);

-- 7. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  default_overlay_opacity FLOAT DEFAULT 0.40 CHECK (default_overlay_opacity BETWEEN 0.05 AND 1.0),
  default_overlay_mode TEXT DEFAULT 'both' CHECK (default_overlay_mode IN ('photo', 'outline', 'both')),
  ai_pose_coach_enabled BOOLEAN DEFAULT TRUE,
  haptics_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PHOTO SESSIONS (Non-image metadata only; never stores photo binaries or pixels)
CREATE TABLE IF NOT EXISTS public.photo_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  pose_id UUID REFERENCES public.poses(id) ON DELETE SET NULL,
  device_platform TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. POSE ATTEMPTS (AI Feedback metadata only, with user consent)
CREATE TABLE IF NOT EXISTS public.pose_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  pose_id UUID REFERENCES public.poses(id) ON DELETE CASCADE,
  similarity_score INT CHECK (similarity_score BETWEEN 0 AND 100),
  feedback_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  pose_id UUID REFERENCES public.poses(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_poses_category ON public.poses(category_id);
CREATE INDEX IF NOT EXISTS idx_poses_collection ON public.poses(collection_id);
CREATE INDEX IF NOT EXISTS idx_poses_is_published ON public.poses(is_published);
CREATE INDEX IF NOT EXISTS idx_poses_is_featured ON public.poses(is_featured);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_pose_landmarks_pose ON public.pose_landmarks(pose_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pose_landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pose_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- POLICIES: Public read for published pose catalog
CREATE POLICY "Public can view published categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public can view published poses" ON public.poses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view validated landmarks" ON public.pose_landmarks FOR SELECT USING (is_validated = true);

-- POLICIES: Users can access their own data
CREATE POLICY "Users can view and edit own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own photo sessions" ON public.photo_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pose attempts" ON public.pose_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert reports" ON public.reports FOR INSERT WITH CHECK (true);
