export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type BodyFraming = 'Full-Body' | 'Upper-Body' | 'Close-Up' | 'Sitting';
export type CameraAngle = 'Eye Level' | 'Low Angle' | 'High Angle' | 'Slight Low' | 'Dutch Angle';

export interface Landmark {
  x: number; // 0.0 to 1.0 (normalized)
  y: number; // 0.0 to 1.0 (normalized)
  z?: number;
  visibility?: number; // 0.0 to 1.0
}

export type OverlayMode = 'photo' | 'outline' | 'both';
export type FramingGuide = 'none' | 'full-body' | 'upper-body' | 'center';

export interface Pose {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  collection_id?: string;
  collection_name?: string;
  reference_image_url: string;
  difficulty: DifficultyLevel;
  body_framing: BodyFraming;
  camera_angle: CameraAngle;
  lighting_tips: string;
  instructions: string[];
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  has_landmarks?: boolean;
  landmarks?: Landmark[];
  isCustom?: boolean;
}

export interface CustomPose {
  id: string;
  title: string;
  imageUri: string;
  landmarks: Landmark[];
  bodyFraming: BodyFraming;
  confidence: number; // 0 - 100
  createdAt: string;
  cameraAngle?: CameraAngle;
  instructions?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image_url: string;
  display_order: number;
  pose_count?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image_url: string;
  is_featured: boolean;
  pose_count?: number;
}

export type AlignmentStatus = 'Needs Adjustment' | 'Getting Closer' | 'Great Match';

export interface JointAngleComparison {
  name: string;
  currentAngle: number;
  targetAngle: number;
  difference: number; // absolute deg difference
  isAligned: boolean;
}

export interface AIAlignmentResult {
  similarityScore: number; // 0 to 100
  status: AlignmentStatus;
  primaryFeedback: string;
  detailedSuggestions: string[];
  jointComparisons: JointAngleComparison[];
  confidence: number;
  isModelReady: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  isGuest: boolean;
  created_at?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  default_overlay_opacity: number;
  default_overlay_mode: OverlayMode;
  ai_pose_coach_enabled: boolean;
  haptics_enabled: boolean;
  show_grid_by_default: boolean;
}

export interface CapturedPhotoMeta {
  id: string;
  uri: string;
  pose_id?: string;
  pose_title?: string;
  saved_to_gallery: boolean;
  captured_at: string;
}
