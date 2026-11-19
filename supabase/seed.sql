-- CamAssis Seed Data
-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, cover_image_url, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Beach', 'beach', 'Sunkissed seaside and shoreline poses for golden hour and sunny vacations.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Selfies', 'selfies', 'Aesthetic mirror selfies, angle tricks, and flattering hand placements.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Couple', 'couple', 'Romantic, candid, and playful poses for two in love.', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Travel', 'travel', 'Architectural framing, scenic viewpoints, and dynamic walk shots.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Fashion', 'fashion', 'Editorial postures, silhouette elongating lines, and outfit checks.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Portrait', 'portrait', 'Clean headshots, shoulder tilts, and expressive gaze directions.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Sitting', 'sitting', 'Chic cafe chairs, stairs, grass sit-downs, and relaxed lounges.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Standing', 'standing', 'Weight-shift techniques, leg lengthening, and confident casual silhouettes.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', 8),
  ('c1000000-0000-0000-0000-000000000009', 'Candid', 'candid', 'Natural in-between movements, laughing moments, and hair tucks.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', 9),
  ('c1000000-0000-0000-0000-000000000010', 'Friends', 'friends', 'Fun group alignments, hug clusters, and walking formations.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', 10),
  ('c1000000-0000-0000-0000-000000000011', 'Wedding', 'wedding', 'Timeless elegance, veil frames, and romantic slow-dance holds.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 11),
  ('c1000000-0000-0000-0000-000000000012', 'Outdoor', 'outdoor', 'Nature backdrops, golden foliage, and open sky framing.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', 12)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Collections
INSERT INTO public.collections (id, name, slug, description, cover_image_url, is_featured)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Beach Days', 'beach-days', 'Effortless oceanfront inspiration from beach towel reads to coastal walks.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', true),
  ('b1000000-0000-0000-0000-000000000002', 'Golden Hour Magic', 'golden-hour-magic', 'Take advantage of warm, low-angle sunlight with glowing silhouettes.', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', true),
  ('b1000000-0000-0000-0000-000000000003', 'City Stroll', 'city-stroll', 'Street style walking shots with urban architecture and crosswalk depth.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Poses (Valid Hex UUIDs starting with 'a')
INSERT INTO public.poses (
  id, title, slug, description, category_id, collection_id, reference_image_url,
  difficulty, body_framing, camera_angle, lighting_tips, instructions, tags, is_featured, is_published
)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Flower Bun Read',
    'flower-bun-read',
    'A tranquil seaside sitting pose holding a book with a floral hair accessory facing the breeze.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=800&q=80',
    'Beginner',
    'Sitting',
    'Eye Level',
    'Natural soft morning sunlight illuminating the book pages and hair details.',
    '["Sit cross-legged or knees up on the beach towel.", "Gently rest an open book in both hands.", "Tilt your head slightly downwards towards the text.", "Keep shoulders relaxed and posture tall.", "Let the sea breeze lightly frame your hair."]'::jsonb,
    ARRAY['beach', 'reading', 'relax', 'aesthetic', 'candid'],
    true,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Hat Lean',
    'hat-lean',
    'Classic sunhat portrait balancing carefree elegance with comfortable weight-shifting.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'Beginner',
    'Upper-Body',
    'Slight Low',
    'Side lighting creates gentle cheekbone shadows while the brim diffuses harsh overhead sun.',
    '["Stand comfortably facing 45 degrees away from the lens.", "Slightly tilt your head towards your back shoulder.", "Hold the hat brim gently with your right hand.", "Shift your weight to your back leg for a natural curve.", "Look slightly away from the camera into the distance."]'::jsonb,
    ARRAY['beach', 'hat', 'summer', 'portrait', 'sunshine'],
    true,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Reading Is Sexy',
    'reading-is-sexy',
    'Playful laying or sitting pose with magazine or book lifted to cheek level.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    'Beginner',
    'Upper-Body',
    'Eye Level',
    'Diffused shade or golden hour backlighting.',
    '["Relax on the sand or beach lounger.", "Hold your reading material up around upper chest height.", "Look over the top of the pages with a subtle smile.", "Drop the opposite elbow casually to create triangle negative space."]'::jsonb,
    ARRAY['beach', 'editorial', 'playful', 'summer'],
    false,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Shoreline Snap',
    'shoreline-snap',
    'Dynamic candid shot capturing movement along the wet shoreline sand reflection.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Intermediate',
    'Full-Body',
    'Low Angle',
    'Low sun reflecting across the wet shoreline sand creating mirror highlights.',
    '["Walk slowly along where the water meets the sand.", "Lift one foot slightly as if caught in mid-stride.", "Let arms swing naturally at your sides.", "Shoot from knee height to capture mirror reflection."]'::jsonb,
    ARRAY['beach', 'fullbody', 'shoreline', 'ocean', 'candid'],
    true,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'Sunset Walk',
    'sunset-walk',
    'Atmospheric stroll away from the camera looking over the shoulder during golden hour.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    'Intermediate',
    'Full-Body',
    'Eye Level',
    'Direct sunset backlighting creating a golden rim light around hair and silhouette.',
    '["Start walking slowly toward the horizon.", "Turn upper torso and glance back over your shoulder.", "Keep one foot trailing to emphasize motion.", "Hold sunglasses or light tote casually in hand."]'::jsonb,
    ARRAY['beach', 'sunset', 'walk', 'goldenhour', 'aesthetic'],
    true,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'Beachside Sitting',
    'beachside-sitting',
    'Relaxed seaside seated pose with one knee pulled up and hand resting on the sand.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'Beginner',
    'Sitting',
    'Slight Low',
    'Side sunset light for warm skin tones and gentle shadow definition.',
    '["Sit directly on the warm sand with legs pointing diagonally.", "Bend your front knee up towards your chest.", "Plant back hand behind you on the sand for support.", "Look across the ocean waves with a serene expression."]'::jsonb,
    ARRAY['beach', 'sitting', 'relax', 'ocean'],
    false,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000007',
    'Looking Away',
    'looking-away',
    'Subtle candid three-quarter profile turning away from the lens.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'Beginner',
    'Upper-Body',
    'Eye Level',
    'Soft overcast or afternoon glow to avoid harsh squinting.',
    '["Angle body 45 degrees towards the light source.", "Turn head 90 degrees away from camera towards an object in distance.", "Tuck hair behind one ear with fingers.", "Keep lips relaxed and jaw un-clenched."]'::jsonb,
    ARRAY['beach', 'portrait', 'profile', 'minimalist'],
    false,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000008',
    'Walking in Water',
    'walking-in-water',
    'Playful ankle-deep splash walk capturing joy and fluid garment motion.',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Intermediate',
    'Full-Body',
    'Low Angle',
    'Bright sparkling sunlight bouncing off shallow water droplets.',
    '["Step ankle-deep into the calm gentle surf.", "Hold hem of dress or shorts with fingertips.", "Take slow deliberate steps kicking up small water ripples.", "Laugh naturally toward your companion or camera."]'::jsonb,
    ARRAY['beach', 'water', 'motion', 'joy', 'vacation'],
    true,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000009',
    'Elevator Mirror Selfie',
    'elevator-mirror-selfie',
    'Urban aesthetic full outfit selfie with clean mirror reflection.',
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'Beginner',
    'Full-Body',
    'Eye Level',
    'Overhead architectural elevator spotlights.',
    '["Stand facing the mirror with weight rested on back hip.", "Hold phone at chest level tilted slightly down.", "Look into the phone screen or lens reflection.", "Keep free hand in your pocket or holding bag."]'::jsonb,
    ARRAY['selfie', 'mirror', 'streetwear', 'ootd'],
    true,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000010',
    'Forehead Touch Romance',
    'forehead-touch-romance',
    'Intimate romantic couple hold with foreheads resting together and gentle embrace.',
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    'Intermediate',
    'Upper-Body',
    'Eye Level',
    'Warm sunset backlighting producing a romantic glow between profiles.',
    '["Step close facing each other.", "Gently rest foreheads together and close eyes.", "Wrap arms around waist and neck softly.", "Smile softly in shared silence."]'::jsonb,
    ARRAY['couple', 'love', 'romance', 'intimate', 'goldenhour'],
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert MediaPipe 33 Landmarks for Poses
INSERT INTO public.pose_landmarks (id, pose_id, landmark_data, landmark_version, image_orientation, is_validated)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '[{"x":0.5,"y":0.22,"visibility":0.98},{"x":0.48,"y":0.2,"visibility":0.95},{"x":0.47,"y":0.2,"visibility":0.95},{"x":0.46,"y":0.2,"visibility":0.9},{"x":0.52,"y":0.2,"visibility":0.95},{"x":0.53,"y":0.2,"visibility":0.95},{"x":0.54,"y":0.2,"visibility":0.9},{"x":0.44,"y":0.21,"visibility":0.85},{"x":0.56,"y":0.21,"visibility":0.85},{"x":0.48,"y":0.25,"visibility":0.9},{"x":0.52,"y":0.25,"visibility":0.9},{"x":0.41,"y":0.36,"visibility":0.98},{"x":0.57,"y":0.35,"visibility":0.98},{"x":0.35,"y":0.5,"visibility":0.95},{"x":0.62,"y":0.48,"visibility":0.95},{"x":0.42,"y":0.6,"visibility":0.95},{"x":0.55,"y":0.58,"visibility":0.95},{"x":0.4,"y":0.63,"visibility":0.8},{"x":0.57,"y":0.61,"visibility":0.8},{"x":0.41,"y":0.64,"visibility":0.8},{"x":0.56,"y":0.62,"visibility":0.8},{"x":0.42,"y":0.62,"visibility":0.8},{"x":0.55,"y":0.6,"visibility":0.8},{"x":0.42,"y":0.62,"visibility":0.95},{"x":0.56,"y":0.62,"visibility":0.95},{"x":0.34,"y":0.74,"visibility":0.95},{"x":0.62,"y":0.72,"visibility":0.95},{"x":0.42,"y":0.85,"visibility":0.95},{"x":0.56,"y":0.84,"visibility":0.95},{"x":0.42,"y":0.88,"visibility":0.85},{"x":0.56,"y":0.87,"visibility":0.85},{"x":0.45,"y":0.89,"visibility":0.85},{"x":0.59,"y":0.88,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', '[{"x":0.52,"y":0.18,"visibility":0.98},{"x":0.5,"y":0.16,"visibility":0.95},{"x":0.49,"y":0.16,"visibility":0.95},{"x":0.48,"y":0.16,"visibility":0.9},{"x":0.54,"y":0.16,"visibility":0.95},{"x":0.55,"y":0.16,"visibility":0.95},{"x":0.56,"y":0.16,"visibility":0.9},{"x":0.46,"y":0.17,"visibility":0.85},{"x":0.58,"y":0.17,"visibility":0.85},{"x":0.5,"y":0.21,"visibility":0.9},{"x":0.54,"y":0.21,"visibility":0.9},{"x":0.4,"y":0.32,"visibility":0.98},{"x":0.58,"y":0.3,"visibility":0.98},{"x":0.36,"y":0.46,"visibility":0.95},{"x":0.66,"y":0.24,"visibility":0.95},{"x":0.38,"y":0.58,"visibility":0.95},{"x":0.56,"y":0.16,"visibility":0.95},{"x":0.36,"y":0.61,"visibility":0.8},{"x":0.58,"y":0.19,"visibility":0.8},{"x":0.37,"y":0.62,"visibility":0.8},{"x":0.57,"y":0.2,"visibility":0.8},{"x":0.38,"y":0.6,"visibility":0.8},{"x":0.56,"y":0.18,"visibility":0.8},{"x":0.43,"y":0.58,"visibility":0.95},{"x":0.55,"y":0.56,"visibility":0.95},{"x":0.44,"y":0.76,"visibility":0.95},{"x":0.56,"y":0.74,"visibility":0.95},{"x":0.43,"y":0.92,"visibility":0.95},{"x":0.57,"y":0.92,"visibility":0.95},{"x":0.43,"y":0.95,"visibility":0.85},{"x":0.57,"y":0.95,"visibility":0.85},{"x":0.46,"y":0.96,"visibility":0.85},{"x":0.6,"y":0.96,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', '[{"x":0.5,"y":0.22,"visibility":0.98},{"x":0.48,"y":0.2,"visibility":0.95},{"x":0.47,"y":0.2,"visibility":0.95},{"x":0.46,"y":0.2,"visibility":0.9},{"x":0.52,"y":0.2,"visibility":0.95},{"x":0.53,"y":0.2,"visibility":0.95},{"x":0.54,"y":0.2,"visibility":0.9},{"x":0.44,"y":0.21,"visibility":0.85},{"x":0.56,"y":0.21,"visibility":0.85},{"x":0.48,"y":0.25,"visibility":0.9},{"x":0.52,"y":0.25,"visibility":0.9},{"x":0.41,"y":0.36,"visibility":0.98},{"x":0.57,"y":0.35,"visibility":0.98},{"x":0.35,"y":0.5,"visibility":0.95},{"x":0.62,"y":0.48,"visibility":0.95},{"x":0.42,"y":0.6,"visibility":0.95},{"x":0.55,"y":0.58,"visibility":0.95},{"x":0.4,"y":0.63,"visibility":0.8},{"x":0.57,"y":0.61,"visibility":0.8},{"x":0.41,"y":0.64,"visibility":0.8},{"x":0.56,"y":0.62,"visibility":0.8},{"x":0.42,"y":0.62,"visibility":0.8},{"x":0.55,"y":0.6,"visibility":0.8},{"x":0.42,"y":0.62,"visibility":0.95},{"x":0.56,"y":0.62,"visibility":0.95},{"x":0.34,"y":0.74,"visibility":0.95},{"x":0.62,"y":0.72,"visibility":0.95},{"x":0.42,"y":0.85,"visibility":0.95},{"x":0.56,"y":0.84,"visibility":0.95},{"x":0.42,"y":0.88,"visibility":0.85},{"x":0.56,"y":0.87,"visibility":0.85},{"x":0.45,"y":0.89,"visibility":0.85},{"x":0.59,"y":0.88,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', '[{"x":0.5,"y":0.16,"visibility":0.98},{"x":0.48,"y":0.14,"visibility":0.95},{"x":0.47,"y":0.14,"visibility":0.95},{"x":0.46,"y":0.14,"visibility":0.9},{"x":0.52,"y":0.14,"visibility":0.95},{"x":0.53,"y":0.14,"visibility":0.95},{"x":0.54,"y":0.14,"visibility":0.9},{"x":0.44,"y":0.15,"visibility":0.85},{"x":0.56,"y":0.15,"visibility":0.85},{"x":0.48,"y":0.19,"visibility":0.9},{"x":0.52,"y":0.19,"visibility":0.9},{"x":0.42,"y":0.28,"visibility":0.98},{"x":0.58,"y":0.28,"visibility":0.98},{"x":0.38,"y":0.42,"visibility":0.95},{"x":0.62,"y":0.4,"visibility":0.95},{"x":0.35,"y":0.54,"visibility":0.95},{"x":0.65,"y":0.52,"visibility":0.95},{"x":0.33,"y":0.57,"visibility":0.8},{"x":0.67,"y":0.55,"visibility":0.8},{"x":0.34,"y":0.58,"visibility":0.8},{"x":0.66,"y":0.56,"visibility":0.8},{"x":0.35,"y":0.56,"visibility":0.8},{"x":0.65,"y":0.54,"visibility":0.8},{"x":0.45,"y":0.54,"visibility":0.95},{"x":0.55,"y":0.54,"visibility":0.95},{"x":0.43,"y":0.72,"visibility":0.95},{"x":0.58,"y":0.7,"visibility":0.95},{"x":0.42,"y":0.9,"visibility":0.95},{"x":0.6,"y":0.88,"visibility":0.95},{"x":0.42,"y":0.93,"visibility":0.85},{"x":0.6,"y":0.91,"visibility":0.85},{"x":0.45,"y":0.94,"visibility":0.85},{"x":0.63,"y":0.92,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', '[{"x":0.5,"y":0.16,"visibility":0.98},{"x":0.48,"y":0.14,"visibility":0.95},{"x":0.47,"y":0.14,"visibility":0.95},{"x":0.46,"y":0.14,"visibility":0.9},{"x":0.52,"y":0.14,"visibility":0.95},{"x":0.53,"y":0.14,"visibility":0.95},{"x":0.54,"y":0.14,"visibility":0.9},{"x":0.44,"y":0.15,"visibility":0.85},{"x":0.56,"y":0.15,"visibility":0.85},{"x":0.48,"y":0.19,"visibility":0.9},{"x":0.52,"y":0.19,"visibility":0.9},{"x":0.42,"y":0.28,"visibility":0.98},{"x":0.58,"y":0.28,"visibility":0.98},{"x":0.38,"y":0.42,"visibility":0.95},{"x":0.62,"y":0.4,"visibility":0.95},{"x":0.35,"y":0.54,"visibility":0.95},{"x":0.65,"y":0.52,"visibility":0.95},{"x":0.33,"y":0.57,"visibility":0.8},{"x":0.67,"y":0.55,"visibility":0.8},{"x":0.34,"y":0.58,"visibility":0.8},{"x":0.66,"y":0.56,"visibility":0.8},{"x":0.35,"y":0.56,"visibility":0.8},{"x":0.65,"y":0.54,"visibility":0.8},{"x":0.45,"y":0.54,"visibility":0.95},{"x":0.55,"y":0.54,"visibility":0.95},{"x":0.43,"y":0.72,"visibility":0.95},{"x":0.58,"y":0.7,"visibility":0.95},{"x":0.42,"y":0.9,"visibility":0.95},{"x":0.6,"y":0.88,"visibility":0.95},{"x":0.42,"y":0.93,"visibility":0.85},{"x":0.6,"y":0.91,"visibility":0.85},{"x":0.45,"y":0.94,"visibility":0.85},{"x":0.63,"y":0.92,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000006', '[{"x":0.5,"y":0.22,"visibility":0.98},{"x":0.48,"y":0.2,"visibility":0.95},{"x":0.47,"y":0.2,"visibility":0.95},{"x":0.46,"y":0.2,"visibility":0.9},{"x":0.52,"y":0.2,"visibility":0.95},{"x":0.53,"y":0.2,"visibility":0.95},{"x":0.54,"y":0.2,"visibility":0.9},{"x":0.44,"y":0.21,"visibility":0.85},{"x":0.56,"y":0.21,"visibility":0.85},{"x":0.48,"y":0.25,"visibility":0.9},{"x":0.52,"y":0.25,"visibility":0.9},{"x":0.41,"y":0.36,"visibility":0.98},{"x":0.57,"y":0.35,"visibility":0.98},{"x":0.35,"y":0.5,"visibility":0.95},{"x":0.62,"y":0.48,"visibility":0.95},{"x":0.42,"y":0.6,"visibility":0.95},{"x":0.55,"y":0.58,"visibility":0.95},{"x":0.4,"y":0.63,"visibility":0.8},{"x":0.57,"y":0.61,"visibility":0.8},{"x":0.41,"y":0.64,"visibility":0.8},{"x":0.56,"y":0.62,"visibility":0.8},{"x":0.42,"y":0.62,"visibility":0.8},{"x":0.55,"y":0.6,"visibility":0.8},{"x":0.42,"y":0.62,"visibility":0.95},{"x":0.56,"y":0.62,"visibility":0.95},{"x":0.34,"y":0.74,"visibility":0.95},{"x":0.62,"y":0.72,"visibility":0.95},{"x":0.42,"y":0.85,"visibility":0.95},{"x":0.56,"y":0.84,"visibility":0.95},{"x":0.42,"y":0.88,"visibility":0.85},{"x":0.56,"y":0.87,"visibility":0.85},{"x":0.45,"y":0.89,"visibility":0.85},{"x":0.59,"y":0.88,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007', '[{"x":0.52,"y":0.18,"visibility":0.98},{"x":0.5,"y":0.16,"visibility":0.95},{"x":0.49,"y":0.16,"visibility":0.95},{"x":0.48,"y":0.16,"visibility":0.9},{"x":0.54,"y":0.16,"visibility":0.95},{"x":0.55,"y":0.16,"visibility":0.95},{"x":0.56,"y":0.16,"visibility":0.9},{"x":0.46,"y":0.17,"visibility":0.85},{"x":0.58,"y":0.17,"visibility":0.85},{"x":0.5,"y":0.21,"visibility":0.9},{"x":0.54,"y":0.21,"visibility":0.9},{"x":0.4,"y":0.32,"visibility":0.98},{"x":0.58,"y":0.3,"visibility":0.98},{"x":0.36,"y":0.46,"visibility":0.95},{"x":0.66,"y":0.24,"visibility":0.95},{"x":0.38,"y":0.58,"visibility":0.95},{"x":0.56,"y":0.16,"visibility":0.95},{"x":0.36,"y":0.61,"visibility":0.8},{"x":0.58,"y":0.19,"visibility":0.8},{"x":0.37,"y":0.62,"visibility":0.8},{"x":0.57,"y":0.2,"visibility":0.8},{"x":0.38,"y":0.6,"visibility":0.8},{"x":0.56,"y":0.18,"visibility":0.8},{"x":0.43,"y":0.58,"visibility":0.95},{"x":0.55,"y":0.56,"visibility":0.95},{"x":0.44,"y":0.76,"visibility":0.95},{"x":0.56,"y":0.74,"visibility":0.95},{"x":0.43,"y":0.92,"visibility":0.95},{"x":0.57,"y":0.92,"visibility":0.95},{"x":0.43,"y":0.95,"visibility":0.85},{"x":0.57,"y":0.95,"visibility":0.85},{"x":0.46,"y":0.96,"visibility":0.85},{"x":0.6,"y":0.96,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000008', '[{"x":0.5,"y":0.16,"visibility":0.98},{"x":0.48,"y":0.14,"visibility":0.95},{"x":0.47,"y":0.14,"visibility":0.95},{"x":0.46,"y":0.14,"visibility":0.9},{"x":0.52,"y":0.14,"visibility":0.95},{"x":0.53,"y":0.14,"visibility":0.95},{"x":0.54,"y":0.14,"visibility":0.9},{"x":0.44,"y":0.15,"visibility":0.85},{"x":0.56,"y":0.15,"visibility":0.85},{"x":0.48,"y":0.19,"visibility":0.9},{"x":0.52,"y":0.19,"visibility":0.9},{"x":0.42,"y":0.28,"visibility":0.98},{"x":0.58,"y":0.28,"visibility":0.98},{"x":0.38,"y":0.42,"visibility":0.95},{"x":0.62,"y":0.4,"visibility":0.95},{"x":0.35,"y":0.54,"visibility":0.95},{"x":0.65,"y":0.52,"visibility":0.95},{"x":0.33,"y":0.57,"visibility":0.8},{"x":0.67,"y":0.55,"visibility":0.8},{"x":0.34,"y":0.58,"visibility":0.8},{"x":0.66,"y":0.56,"visibility":0.8},{"x":0.35,"y":0.56,"visibility":0.8},{"x":0.65,"y":0.54,"visibility":0.8},{"x":0.45,"y":0.54,"visibility":0.95},{"x":0.55,"y":0.54,"visibility":0.95},{"x":0.43,"y":0.72,"visibility":0.95},{"x":0.58,"y":0.7,"visibility":0.95},{"x":0.42,"y":0.9,"visibility":0.95},{"x":0.6,"y":0.88,"visibility":0.95},{"x":0.42,"y":0.93,"visibility":0.85},{"x":0.6,"y":0.91,"visibility":0.85},{"x":0.45,"y":0.94,"visibility":0.85},{"x":0.63,"y":0.92,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000009', '[{"x":0.5,"y":0.16,"visibility":0.98},{"x":0.48,"y":0.14,"visibility":0.95},{"x":0.47,"y":0.14,"visibility":0.95},{"x":0.46,"y":0.14,"visibility":0.9},{"x":0.52,"y":0.14,"visibility":0.95},{"x":0.53,"y":0.14,"visibility":0.95},{"x":0.54,"y":0.14,"visibility":0.9},{"x":0.44,"y":0.15,"visibility":0.85},{"x":0.56,"y":0.15,"visibility":0.85},{"x":0.48,"y":0.19,"visibility":0.9},{"x":0.52,"y":0.19,"visibility":0.9},{"x":0.42,"y":0.28,"visibility":0.98},{"x":0.58,"y":0.28,"visibility":0.98},{"x":0.38,"y":0.42,"visibility":0.95},{"x":0.62,"y":0.4,"visibility":0.95},{"x":0.35,"y":0.54,"visibility":0.95},{"x":0.65,"y":0.52,"visibility":0.95},{"x":0.33,"y":0.57,"visibility":0.8},{"x":0.67,"y":0.55,"visibility":0.8},{"x":0.34,"y":0.58,"visibility":0.8},{"x":0.66,"y":0.56,"visibility":0.8},{"x":0.35,"y":0.56,"visibility":0.8},{"x":0.65,"y":0.54,"visibility":0.8},{"x":0.45,"y":0.54,"visibility":0.95},{"x":0.55,"y":0.54,"visibility":0.95},{"x":0.43,"y":0.72,"visibility":0.95},{"x":0.58,"y":0.7,"visibility":0.95},{"x":0.42,"y":0.9,"visibility":0.95},{"x":0.6,"y":0.88,"visibility":0.95},{"x":0.42,"y":0.93,"visibility":0.85},{"x":0.6,"y":0.91,"visibility":0.85},{"x":0.45,"y":0.94,"visibility":0.85},{"x":0.63,"y":0.92,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true),
  ('d1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000010', '[{"x":0.52,"y":0.18,"visibility":0.98},{"x":0.5,"y":0.16,"visibility":0.95},{"x":0.49,"y":0.16,"visibility":0.95},{"x":0.48,"y":0.16,"visibility":0.9},{"x":0.54,"y":0.16,"visibility":0.95},{"x":0.55,"y":0.16,"visibility":0.95},{"x":0.56,"y":0.16,"visibility":0.9},{"x":0.46,"y":0.17,"visibility":0.85},{"x":0.58,"y":0.17,"visibility":0.85},{"x":0.5,"y":0.21,"visibility":0.9},{"x":0.54,"y":0.21,"visibility":0.9},{"x":0.4,"y":0.32,"visibility":0.98},{"x":0.58,"y":0.3,"visibility":0.98},{"x":0.36,"y":0.46,"visibility":0.95},{"x":0.66,"y":0.24,"visibility":0.95},{"x":0.38,"y":0.58,"visibility":0.95},{"x":0.56,"y":0.16,"visibility":0.95},{"x":0.36,"y":0.61,"visibility":0.8},{"x":0.58,"y":0.19,"visibility":0.8},{"x":0.37,"y":0.62,"visibility":0.8},{"x":0.57,"y":0.2,"visibility":0.8},{"x":0.38,"y":0.6,"visibility":0.8},{"x":0.56,"y":0.18,"visibility":0.8},{"x":0.43,"y":0.58,"visibility":0.95},{"x":0.55,"y":0.56,"visibility":0.95},{"x":0.44,"y":0.76,"visibility":0.95},{"x":0.56,"y":0.74,"visibility":0.95},{"x":0.43,"y":0.92,"visibility":0.95},{"x":0.57,"y":0.92,"visibility":0.95},{"x":0.43,"y":0.95,"visibility":0.85},{"x":0.57,"y":0.95,"visibility":0.85},{"x":0.46,"y":0.96,"visibility":0.85},{"x":0.6,"y":0.96,"visibility":0.85}]'::jsonb, 'mediapipe_v1', 'portrait', true)
ON CONFLICT (pose_id) DO NOTHING;