import { AlignmentStatus, JointAngleComparison, Landmark } from '../types';
import { BoundingBox } from './normalization';
import { PoseLandmarkIndex, isLandmarkReliable } from './landmarks';

interface FeedbackInput {
  similarityScore: number;
  status: AlignmentStatus;
  jointComparisons: JointAngleComparison[];
  userBBox: BoundingBox;
  targetBBox: BoundingBox;
  userLandmarks: Landmark[];
  targetLandmarks: Landmark[];
  isMirrored: boolean;
}

export function generatePoseFeedback(input: FeedbackInput): {
  primaryFeedback: string;
  detailedSuggestions: string[];
} {
  const {
    similarityScore,
    status,
    jointComparisons,
    userBBox,
    targetBBox,
    userLandmarks,
    targetLandmarks,
    isMirrored,
  } = input;

  const suggestions: string[] = [];

  // If score is already high
  if (similarityScore >= 88) {
    return {
      primaryFeedback: 'Perfect alignment! Hold still ✨',
      detailedSuggestions: ['Your pose is aligned with the reference.', 'Ready to capture!'],
    };
  }

  if (similarityScore >= 80) {
    return {
      primaryFeedback: 'Great match! Just slight adjustments',
      detailedSuggestions: ['Almost exact match with the reference pose.', 'Hold steady for a crisp shot.'],
    };
  }

  // 1. Framing & Positioning feedback
  const xDiff = userBBox.centerX - targetBBox.centerX;
  const sizeRatio = userBBox.height / Math.max(targetBBox.height, 0.1);

  if (sizeRatio < 0.7) {
    suggestions.push('Step a little closer to the camera.');
  } else if (sizeRatio > 1.35) {
    suggestions.push('Step slightly back for better framing.');
  }

  if (Math.abs(xDiff) > 0.15) {
    // If user is shifted horizontally
    if (isMirrored) {
      suggestions.push(xDiff > 0 ? 'Move slightly to your right.' : 'Move slightly to your left.');
    } else {
      suggestions.push(xDiff > 0 ? 'Move slightly to your left.' : 'Move slightly to your right.');
    }
  }

  // 2. Specific Joint / Limbs Corrections
  // Sort joints by highest angle discrepancy
  const unalignedJoints = jointComparisons
    .filter(j => !j.isAligned)
    .sort((a, b) => b.difference - a.difference);

  for (const joint of unalignedJoints) {
    if (joint.name === 'Left Elbow') {
      const uElbow = userLandmarks[PoseLandmarkIndex.LEFT_ELBOW];
      const tElbow = targetLandmarks[PoseLandmarkIndex.LEFT_ELBOW];
      const isHigher = uElbow && tElbow && uElbow.y > tElbow.y;
      suggestions.push(
        joint.currentAngle < joint.targetAngle
          ? isHigher ? 'Raise your left arm and open elbow' : 'Open your left elbow slightly'
          : 'Bend your left arm more'
      );
    } else if (joint.name === 'Right Elbow') {
      const uElbow = userLandmarks[PoseLandmarkIndex.RIGHT_ELBOW];
      const tElbow = targetLandmarks[PoseLandmarkIndex.RIGHT_ELBOW];
      const isHigher = uElbow && tElbow && uElbow.y > tElbow.y;
      suggestions.push(
        joint.currentAngle < joint.targetAngle
          ? isHigher ? 'Raise your right arm higher' : 'Open your right arm slightly'
          : 'Bend your right elbow slightly'
      );
    } else if (joint.name === 'Left Knee') {
      suggestions.push(
        joint.currentAngle > joint.targetAngle ? 'Bend your left knee slightly' : 'Straighten your left leg slightly'
      );
    } else if (joint.name === 'Right Knee') {
      suggestions.push(
        joint.currentAngle > joint.targetAngle ? 'Bend your right knee slightly' : 'Straighten your right leg slightly'
      );
    } else if (joint.name === 'Left Shoulder' || joint.name === 'Right Shoulder') {
      suggestions.push(`Adjust your ${joint.name.toLowerCase()} angle to match the posture.`);
    }
  }

  // 3. Head / tilt check
  const uNose = userLandmarks[PoseLandmarkIndex.NOSE];
  const uShoulderL = userLandmarks[PoseLandmarkIndex.LEFT_SHOULDER];
  const uShoulderR = userLandmarks[PoseLandmarkIndex.RIGHT_SHOULDER];

  if (isLandmarkReliable(uNose) && isLandmarkReliable(uShoulderL) && isLandmarkReliable(uShoulderR)) {
    const shoulderSlope = (uShoulderR.y - uShoulderL.y) / Math.max(0.001, Math.abs(uShoulderR.x - uShoulderL.x));
    if (Math.abs(shoulderSlope) > 0.3) {
      suggestions.push('Level your shoulders.');
    }
  }

  // Fallback if no specific suggestion generated
  if (suggestions.length === 0) {
    if (status === 'Getting Closer') {
      suggestions.push('Fine-tune your posture and arms to lock the pose.');
    } else {
      suggestions.push('Align your head, torso, and limbs with the ghost guide.');
    }
  }

  const primaryFeedback = suggestions[0];
  const detailedSuggestions = suggestions.slice(0, 4);

  return { primaryFeedback, detailedSuggestions };
}
