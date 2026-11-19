import { Landmark, AIAlignmentResult, JointAngleComparison, AlignmentStatus } from '../types';
import { PoseLandmarkIndex, isLandmarkReliable } from './landmarks';
import { normalizeLandmarks, getLandmarkBoundingBox } from './normalization';
import { generatePoseFeedback } from './pose-feedback';

/**
 * Calculates the interior angle in degrees at vertex B between ray BA and BC.
 */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

interface JointDefinition {
  name: string;
  indices: [number, number, number]; // [A, Vertex B, C]
  weight: number;
  toleranceDeg: number;
}

const KEY_JOINTS: JointDefinition[] = [
  {
    name: 'Left Elbow',
    indices: [PoseLandmarkIndex.LEFT_SHOULDER, PoseLandmarkIndex.LEFT_ELBOW, PoseLandmarkIndex.LEFT_WRIST],
    weight: 1.0,
    toleranceDeg: 25,
  },
  {
    name: 'Right Elbow',
    indices: [PoseLandmarkIndex.RIGHT_SHOULDER, PoseLandmarkIndex.RIGHT_ELBOW, PoseLandmarkIndex.RIGHT_WRIST],
    weight: 1.0,
    toleranceDeg: 25,
  },
  {
    name: 'Left Shoulder',
    indices: [PoseLandmarkIndex.LEFT_HIP, PoseLandmarkIndex.LEFT_SHOULDER, PoseLandmarkIndex.LEFT_ELBOW],
    weight: 1.2,
    toleranceDeg: 25,
  },
  {
    name: 'Right Shoulder',
    indices: [PoseLandmarkIndex.RIGHT_HIP, PoseLandmarkIndex.RIGHT_SHOULDER, PoseLandmarkIndex.RIGHT_ELBOW],
    weight: 1.2,
    toleranceDeg: 25,
  },
  {
    name: 'Left Knee',
    indices: [PoseLandmarkIndex.LEFT_HIP, PoseLandmarkIndex.LEFT_KNEE, PoseLandmarkIndex.LEFT_ANKLE],
    weight: 1.0,
    toleranceDeg: 25,
  },
  {
    name: 'Right Knee',
    indices: [PoseLandmarkIndex.RIGHT_HIP, PoseLandmarkIndex.RIGHT_KNEE, PoseLandmarkIndex.RIGHT_ANKLE],
    weight: 1.0,
    toleranceDeg: 25,
  },
  {
    name: 'Left Hip',
    indices: [PoseLandmarkIndex.LEFT_SHOULDER, PoseLandmarkIndex.LEFT_HIP, PoseLandmarkIndex.LEFT_KNEE],
    weight: 1.1,
    toleranceDeg: 30,
  },
  {
    name: 'Right Hip',
    indices: [PoseLandmarkIndex.RIGHT_SHOULDER, PoseLandmarkIndex.RIGHT_HIP, PoseLandmarkIndex.RIGHT_KNEE],
    weight: 1.1,
    toleranceDeg: 30,
  },
];

/**
 * Compares detected landmarks from live camera with target reference pose landmarks.
 */
export function comparePoses(
  userLandmarks: Landmark[],
  targetLandmarks: Landmark[],
  isMirrored: boolean = false
): AIAlignmentResult {
  if (!userLandmarks || userLandmarks.length < 15 || !targetLandmarks || targetLandmarks.length < 15) {
    return {
      similarityScore: 0,
      status: 'Needs Adjustment',
      primaryFeedback: 'Position yourself within camera frame',
      detailedSuggestions: ['Make sure your body is clearly visible in the camera preview.'],
      jointComparisons: [],
      confidence: 0,
      isModelReady: true,
    };
  }

  // 1. Joint Angle Comparison
  const jointComparisons: JointAngleComparison[] = [];
  let totalAngleScore = 0;
  let totalAngleWeight = 0;

  for (const joint of KEY_JOINTS) {
    const [idxA, idxB, idxC] = joint.indices;
    const uA = userLandmarks[idxA];
    const uB = userLandmarks[idxB];
    const uC = userLandmarks[idxC];

    const tA = targetLandmarks[idxA];
    const tB = targetLandmarks[idxB];
    const tC = targetLandmarks[idxC];

    if (
      isLandmarkReliable(uA) &&
      isLandmarkReliable(uB) &&
      isLandmarkReliable(uC) &&
      isLandmarkReliable(tA) &&
      isLandmarkReliable(tB) &&
      isLandmarkReliable(tC)
    ) {
      const uAngle = calculateAngle(uA, uB, uC);
      const tAngle = calculateAngle(tA, tB, tC);
      const diff = Math.abs(uAngle - tAngle);

      // Score for this joint: 100 if diff <= 10 deg, decays towards 0 at 90 deg
      const jointScore = Math.max(0, 100 - (diff / joint.toleranceDeg) * 35);
      totalAngleScore += jointScore * joint.weight;
      totalAngleWeight += joint.weight;

      jointComparisons.push({
        name: joint.name,
        currentAngle: uAngle,
        targetAngle: tAngle,
        difference: diff,
        isAligned: diff <= joint.toleranceDeg,
      });
    }
  }

  const angleScore = totalAngleWeight > 0 ? totalAngleScore / totalAngleWeight : 50;

  // 2. Normalized Coordinate Distance
  const normUser = normalizeLandmarks(userLandmarks, isMirrored);
  const normTarget = normalizeLandmarks(targetLandmarks, false);

  let totalDistScore = 0;
  let totalDistWeight = 0;

  const landmarkWeights: Record<number, number> = {
    [PoseLandmarkIndex.NOSE]: 0.8,
    [PoseLandmarkIndex.LEFT_SHOULDER]: 1.3,
    [PoseLandmarkIndex.RIGHT_SHOULDER]: 1.3,
    [PoseLandmarkIndex.LEFT_ELBOW]: 1.0,
    [PoseLandmarkIndex.RIGHT_ELBOW]: 1.0,
    [PoseLandmarkIndex.LEFT_WRIST]: 1.2,
    [PoseLandmarkIndex.RIGHT_WRIST]: 1.2,
    [PoseLandmarkIndex.LEFT_HIP]: 1.2,
    [PoseLandmarkIndex.RIGHT_HIP]: 1.2,
    [PoseLandmarkIndex.LEFT_KNEE]: 1.0,
    [PoseLandmarkIndex.RIGHT_KNEE]: 1.0,
    [PoseLandmarkIndex.LEFT_ANKLE]: 1.0,
    [PoseLandmarkIndex.RIGHT_ANKLE]: 1.0,
  };

  for (const [idxStr, weight] of Object.entries(landmarkWeights)) {
    const idx = Number(idxStr);
    const u = normUser[idx];
    const t = normTarget[idx];

    if (u && t && isLandmarkReliable(userLandmarks[idx]) && isLandmarkReliable(targetLandmarks[idx])) {
      const dist = Math.hypot(u.x - t.x, u.y - t.y);
      // Normalized distance score: 0 dist = 100%, 0.5 dist = 50%, >1.0 dist = 0
      const pointScore = Math.max(0, 100 - dist * 100);
      totalDistScore += pointScore * weight;
      totalDistWeight += weight;
    }
  }

  const distScore = totalDistWeight > 0 ? totalDistScore / totalDistWeight : 50;

  // 3. Combined Similarity Score
  const rawSimilarity = 0.55 * angleScore + 0.45 * distScore;
  const similarityScore = Math.min(100, Math.max(0, Math.round(rawSimilarity)));

  // 4. Status
  let status: AlignmentStatus = 'Needs Adjustment';
  if (similarityScore >= 80) {
    status = 'Great Match';
  } else if (similarityScore >= 60) {
    status = 'Getting Closer';
  }

  // 5. Generate Natural Language Feedback
  const userBBox = getLandmarkBoundingBox(userLandmarks);
  const targetBBox = getLandmarkBoundingBox(targetLandmarks);

  const { primaryFeedback, detailedSuggestions } = generatePoseFeedback({
    similarityScore,
    status,
    jointComparisons,
    userBBox,
    targetBBox,
    userLandmarks,
    targetLandmarks,
    isMirrored,
  });

  return {
    similarityScore,
    status,
    primaryFeedback,
    detailedSuggestions,
    jointComparisons,
    confidence: Math.round((totalAngleWeight / (KEY_JOINTS.length * 1.2)) * 100),
    isModelReady: true,
  };
}
