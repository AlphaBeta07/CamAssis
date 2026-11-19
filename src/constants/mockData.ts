import { Category, Collection, Pose, Landmark } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Beach',
    slug: 'beach',
    description: 'Sunkissed seaside and shoreline poses for golden hour and sunny vacations.',
    cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    pose_count: 8,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Selfies',
    slug: 'selfies',
    description: 'Aesthetic mirror selfies, angle tricks, and flattering hand placements.',
    cover_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    pose_count: 4,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Couple',
    slug: 'couple',
    description: 'Romantic, candid, and playful poses for two in love.',
    cover_image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    pose_count: 5,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Travel',
    slug: 'travel',
    description: 'Architectural framing, scenic viewpoints, and dynamic walk shots.',
    cover_image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    pose_count: 6,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Editorial postures, silhouette elongating lines, and outfit checks.',
    cover_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    pose_count: 6,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Portrait',
    slug: 'portrait',
    description: 'Clean headshots, shoulder tilts, and expressive gaze directions.',
    cover_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    display_order: 6,
    pose_count: 7,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Sitting',
    slug: 'sitting',
    description: 'Chic cafe chairs, stairs, grass sit-downs, and relaxed lounges.',
    cover_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    display_order: 7,
    pose_count: 5,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    name: 'Standing',
    slug: 'standing',
    description: 'Weight-shift techniques, leg lengthening, and confident casual silhouettes.',
    cover_image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    display_order: 8,
    pose_count: 8,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000009',
    name: 'Candid',
    slug: 'candid',
    description: 'Natural in-between movements, laughing moments, and hair tucks.',
    cover_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    display_order: 9,
    pose_count: 6,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000010',
    name: 'Friends',
    slug: 'friends',
    description: 'Fun group alignments, hug clusters, and walking formations.',
    cover_image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    display_order: 10,
    pose_count: 4,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000011',
    name: 'Wedding',
    slug: 'wedding',
    description: 'Timeless elegance, veil frames, and romantic slow-dance holds.',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    display_order: 11,
    pose_count: 4,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000012',
    name: 'Outdoor',
    slug: 'outdoor',
    description: 'Nature backdrops, golden foliage, and open sky framing.',
    cover_image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    display_order: 12,
    pose_count: 5,
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    name: 'Beach Days',
    slug: 'beach-days',
    description: 'Effortless oceanfront inspiration from beach towel reads to coastal shoreline strolls.',
    cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    pose_count: 8,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    name: 'Golden Hour Magic',
    slug: 'golden-hour-magic',
    description: 'Take advantage of warm, low-angle sunlight with glowing silhouettes and backlight glows.',
    cover_image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    pose_count: 6,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    name: 'City Stroll',
    slug: 'city-stroll',
    description: 'Street style walking shots with architectural lines, cafes, and crosswalk depth.',
    cover_image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    pose_count: 5,
  },
];

// Helper to generate a full 33-point MediaPipe landmark array with custom variation
function createLandmarks(config: {
  head: [number, number];
  shoulderL: [number, number];
  shoulderR: [number, number];
  elbowL: [number, number];
  elbowR: [number, number];
  wristL: [number, number];
  wristR: [number, number];
  hipL: [number, number];
  hipR: [number, number];
  kneeL: [number, number];
  kneeR: [number, number];
  ankleL: [number, number];
  ankleR: [number, number];
}): Landmark[] {
  const lm: Landmark[] = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));

  const hx = config.head[0];
  const hy = config.head[1];

  // 0: Nose
  lm[0] = { x: hx, y: hy, visibility: 0.98 };
  // Eyes
  lm[1] = { x: hx - 0.02, y: hy - 0.02, visibility: 0.95 };
  lm[2] = { x: hx - 0.03, y: hy - 0.02, visibility: 0.95 };
  lm[3] = { x: hx - 0.04, y: hy - 0.02, visibility: 0.9 };
  lm[4] = { x: hx + 0.02, y: hy - 0.02, visibility: 0.95 };
  lm[5] = { x: hx + 0.03, y: hy - 0.02, visibility: 0.95 };
  lm[6] = { x: hx + 0.04, y: hy - 0.02, visibility: 0.9 };
  // Ears
  lm[7] = { x: hx - 0.06, y: hy - 0.01, visibility: 0.85 };
  lm[8] = { x: hx + 0.06, y: hy - 0.01, visibility: 0.85 };
  // Mouth
  lm[9] = { x: hx - 0.02, y: hy + 0.03, visibility: 0.9 };
  lm[10] = { x: hx + 0.02, y: hy + 0.03, visibility: 0.9 };

  // Upper Body
  lm[11] = { x: config.shoulderL[0], y: config.shoulderL[1], visibility: 0.98 };
  lm[12] = { x: config.shoulderR[0], y: config.shoulderR[1], visibility: 0.98 };
  lm[13] = { x: config.elbowL[0], y: config.elbowL[1], visibility: 0.95 };
  lm[14] = { x: config.elbowR[0], y: config.elbowR[1], visibility: 0.95 };
  lm[15] = { x: config.wristL[0], y: config.wristL[1], visibility: 0.95 };
  lm[16] = { x: config.wristR[0], y: config.wristR[1], visibility: 0.95 };

  // Hands fingers
  lm[17] = { x: config.wristL[0] - 0.02, y: config.wristL[1] + 0.03, visibility: 0.8 };
  lm[18] = { x: config.wristR[0] + 0.02, y: config.wristR[1] + 0.03, visibility: 0.8 };
  lm[19] = { x: config.wristL[0] - 0.01, y: config.wristL[1] + 0.04, visibility: 0.8 };
  lm[20] = { x: config.wristR[0] + 0.01, y: config.wristR[1] + 0.04, visibility: 0.8 };
  lm[21] = { x: config.wristL[0], y: config.wristL[1] + 0.02, visibility: 0.8 };
  lm[22] = { x: config.wristR[0], y: config.wristR[1] + 0.02, visibility: 0.8 };

  // Torso / Hips
  lm[23] = { x: config.hipL[0], y: config.hipL[1], visibility: 0.95 };
  lm[24] = { x: config.hipR[0], y: config.hipR[1], visibility: 0.95 };

  // Lower Body
  lm[25] = { x: config.kneeL[0], y: config.kneeL[1], visibility: 0.95 };
  lm[26] = { x: config.kneeR[0], y: config.kneeR[1], visibility: 0.95 };
  lm[27] = { x: config.ankleL[0], y: config.ankleL[1], visibility: 0.95 };
  lm[28] = { x: config.ankleR[0], y: config.ankleR[1], visibility: 0.95 };

  // Feet
  lm[29] = { x: config.ankleL[0], y: config.ankleL[1] + 0.03, visibility: 0.85 };
  lm[30] = { x: config.ankleR[0], y: config.ankleR[1] + 0.03, visibility: 0.85 };
  lm[31] = { x: config.ankleL[0] + 0.03, y: config.ankleL[1] + 0.04, visibility: 0.85 };
  lm[32] = { x: config.ankleR[0] + 0.03, y: config.ankleR[1] + 0.04, visibility: 0.85 };

  return lm;
}

// Preset standard human poses landmarks
const STANDING_WALK_LANDMARKS = createLandmarks({
  head: [0.5, 0.16],
  shoulderL: [0.42, 0.28],
  shoulderR: [0.58, 0.28],
  elbowL: [0.38, 0.42],
  elbowR: [0.62, 0.40],
  wristL: [0.35, 0.54],
  wristR: [0.65, 0.52],
  hipL: [0.45, 0.54],
  hipR: [0.55, 0.54],
  kneeL: [0.43, 0.72],
  kneeR: [0.58, 0.70],
  ankleL: [0.42, 0.90],
  ankleR: [0.60, 0.88],
});

const HAT_LEAN_LANDMARKS = createLandmarks({
  head: [0.52, 0.18],
  shoulderL: [0.40, 0.32],
  shoulderR: [0.58, 0.30],
  elbowL: [0.36, 0.46],
  elbowR: [0.66, 0.24], // Right arm up touching hat brim
  wristL: [0.38, 0.58],
  wristR: [0.56, 0.16], // Right hand on hat
  hipL: [0.43, 0.58],
  hipR: [0.55, 0.56],
  kneeL: [0.44, 0.76],
  kneeR: [0.56, 0.74],
  ankleL: [0.43, 0.92],
  ankleR: [0.57, 0.92],
});

const SITTING_LANDMARKS = createLandmarks({
  head: [0.50, 0.22],
  shoulderL: [0.41, 0.36],
  shoulderR: [0.57, 0.35],
  elbowL: [0.35, 0.50],
  elbowR: [0.62, 0.48],
  wristL: [0.42, 0.60],
  wristR: [0.55, 0.58],
  hipL: [0.42, 0.62],
  hipR: [0.56, 0.62],
  kneeL: [0.34, 0.74],
  kneeR: [0.62, 0.72],
  ankleL: [0.42, 0.85],
  ankleR: [0.56, 0.84],
});

export const MOCK_POSES: Pose[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Flower Bun Read',
    slug: 'flower-bun-read',
    description: 'A tranquil seaside sitting pose holding a book with a floral hair accessory facing the breeze.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Beginner',
    body_framing: 'Sitting',
    camera_angle: 'Eye Level',
    lighting_tips: 'Natural soft morning sunlight illuminating the book pages and hair details.',
    instructions: [
      'Sit comfortably cross-legged or with knees angled on the beach towel.',
      'Gently rest an open book in both hands at chest level.',
      'Tilt your head slightly downwards towards the text.',
      'Keep shoulders relaxed and posture tall.',
      'Let the sea breeze lightly frame your hair.',
    ],
    tags: ['beach', 'reading', 'relax', 'aesthetic', 'candid'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: SITTING_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    title: 'Hat Lean',
    slug: 'hat-lean',
    description: 'Classic sunhat portrait balancing carefree elegance with comfortable weight-shifting.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Beginner',
    body_framing: 'Upper-Body',
    camera_angle: 'Slight Low',
    lighting_tips: 'Side lighting creates gentle cheekbone shadows while brim diffuses harsh overhead sun.',
    instructions: [
      'Stand comfortably facing 45 degrees away from the lens.',
      'Slightly tilt your head towards your back shoulder.',
      'Hold the hat brim gently with your right hand.',
      'Shift your weight to your back leg for a natural curve.',
      'Look slightly away from the camera into the distance.',
    ],
    tags: ['beach', 'hat', 'summer', 'portrait', 'sunshine'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: HAT_LEAN_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    title: 'Reading Is Sexy',
    slug: 'reading-is-sexy',
    description: 'Playful laying or sitting pose with magazine or book lifted to cheek level.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Beginner',
    body_framing: 'Upper-Body',
    camera_angle: 'Eye Level',
    lighting_tips: 'Diffused shade or golden hour backlighting.',
    instructions: [
      'Relax on the sand or beach lounger.',
      'Hold your reading material up around upper chest height.',
      'Look over the top of the pages with a subtle smile.',
      'Drop the opposite elbow casually to create triangle negative space.',
    ],
    tags: ['beach', 'editorial', 'playful', 'summer'],
    is_featured: false,
    is_published: true,
    has_landmarks: true,
    landmarks: SITTING_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    title: 'Shoreline Snap',
    slug: 'shoreline-snap',
    description: 'Dynamic candid shot capturing movement along the wet shoreline sand reflection.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Intermediate',
    body_framing: 'Full-Body',
    camera_angle: 'Low Angle',
    lighting_tips: 'Low sun reflecting across the wet shoreline sand creating mirror highlights.',
    instructions: [
      'Walk slowly along where the water meets the sand.',
      'Lift one foot slightly as if caught in mid-stride.',
      'Let arms swing naturally at your sides.',
      'Shoot from knee height to capture mirror reflection.',
    ],
    tags: ['beach', 'fullbody', 'shoreline', 'ocean', 'candid'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: STANDING_WALK_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    title: 'Sunset Walk',
    slug: 'sunset-walk',
    description: 'Atmospheric stroll away from the camera looking over the shoulder during golden hour.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Intermediate',
    body_framing: 'Full-Body',
    camera_angle: 'Eye Level',
    lighting_tips: 'Direct sunset backlighting creating a golden rim light around hair and silhouette.',
    instructions: [
      'Start walking slowly toward the horizon.',
      'Turn upper torso and glance back over your shoulder.',
      'Keep one foot trailing to emphasize motion.',
      'Hold sunglasses or light tote casually in hand.',
    ],
    tags: ['beach', 'sunset', 'walk', 'goldenhour', 'aesthetic'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: STANDING_WALK_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    title: 'Beachside Sitting',
    slug: 'beachside-sitting',
    description: 'Relaxed seaside seated pose with one knee pulled up and hand resting on the sand.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Beginner',
    body_framing: 'Sitting',
    camera_angle: 'Slight Low',
    lighting_tips: 'Side sunset light for warm skin tones and gentle shadow definition.',
    instructions: [
      'Sit directly on the warm sand with legs pointing diagonally.',
      'Bend your front knee up towards your chest.',
      'Plant back hand behind you on the sand for support.',
      'Look across the ocean waves with a serene expression.',
    ],
    tags: ['beach', 'sitting', 'relax', 'ocean'],
    is_featured: false,
    is_published: true,
    has_landmarks: true,
    landmarks: SITTING_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000007',
    title: 'Looking Away',
    slug: 'looking-away',
    description: 'Subtle candid three-quarter profile turning away from the lens.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Beginner',
    body_framing: 'Upper-Body',
    camera_angle: 'Eye Level',
    lighting_tips: 'Soft overcast or afternoon glow to avoid harsh squinting.',
    instructions: [
      'Angle body 45 degrees towards the light source.',
      'Turn head 90 degrees away from camera towards an object in distance.',
      'Tuck hair behind one ear with fingers.',
      'Keep lips relaxed and jaw un-clenched.',
    ],
    tags: ['beach', 'portrait', 'profile', 'minimalist'],
    is_featured: false,
    is_published: true,
    has_landmarks: true,
    landmarks: HAT_LEAN_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000008',
    title: 'Walking in Water',
    slug: 'walking-in-water',
    description: 'Playful ankle-deep splash walk capturing joy and fluid garment motion.',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    category_name: 'Beach',
    collection_id: 'b1000000-0000-0000-0000-000000000001',
    collection_name: 'Beach Days',
    reference_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Intermediate',
    body_framing: 'Full-Body',
    camera_angle: 'Low Angle',
    lighting_tips: 'Bright sparkling sunlight bouncing off shallow water droplets.',
    instructions: [
      'Step ankle-deep into the calm gentle surf.',
      'Hold hem of dress or shorts with fingertips.',
      'Take slow deliberate steps kicking up small water ripples.',
      'Laugh naturally toward your companion or camera.',
    ],
    tags: ['beach', 'water', 'motion', 'joy', 'vacation'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: STANDING_WALK_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000009',
    title: 'Elevator Mirror Selfie',
    slug: 'elevator-mirror-selfie',
    description: 'Urban aesthetic full outfit selfie with clean mirror reflection.',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    category_name: 'Selfies',
    collection_id: 'b1000000-0000-0000-0000-000000000003',
    collection_name: 'City Stroll',
    reference_image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Beginner',
    body_framing: 'Full-Body',
    camera_angle: 'Eye Level',
    lighting_tips: 'Overhead architectural elevator spotlights.',
    instructions: [
      'Stand facing the mirror with weight rested on back hip.',
      'Hold phone at chest level tilted slightly down.',
      'Look into the phone screen or lens reflection.',
      'Keep free hand in your pocket or holding bag.',
    ],
    tags: ['selfie', 'mirror', 'streetwear', 'ootd'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: STANDING_WALK_LANDMARKS,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000010',
    title: 'Forehead Touch Romance',
    slug: 'forehead-touch-romance',
    description: 'Intimate romantic couple hold with foreheads resting together and gentle embrace.',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    category_name: 'Couple',
    collection_id: 'b1000000-0000-0000-0000-000000000002',
    collection_name: 'Golden Hour Magic',
    reference_image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    difficulty: 'Intermediate',
    body_framing: 'Upper-Body',
    camera_angle: 'Eye Level',
    lighting_tips: 'Warm sunset backlighting producing a romantic glow between profiles.',
    instructions: [
      'Step close facing each other.',
      'Gently rest foreheads together and close eyes.',
      'Wrap arms around waist and neck softly.',
      'Smile softly in shared silence.',
    ],
    tags: ['couple', 'love', 'romance', 'intimate', 'goldenhour'],
    is_featured: true,
    is_published: true,
    has_landmarks: true,
    landmarks: HAT_LEAN_LANDMARKS,
  },
];
