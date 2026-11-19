import { Landmark } from '../types';
import { PoseLandmarkIndex, isLandmarkReliable } from './landmarks';

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

/**
 * Calculates the bounding box of a set of landmarks.
 */
export function getLandmarkBoundingBox(landmarks: Landmark[]): BoundingBox {
  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;

  for (const lm of landmarks) {
    if (isLandmarkReliable(lm)) {
      if (lm.x < minX) minX = lm.x;
      if (lm.x > maxX) maxX = lm.x;
      if (lm.y < minY) minY = lm.y;
      if (lm.y > maxY) maxY = lm.y;
    }
  }

  // Safety fallback if no reliable landmarks found
  if (minX > maxX) {
    minX = 0.2;
    maxX = 0.8;
    minY = 0.1;
    maxY = 0.9;
  }

  const width = Math.max(maxX - minX, 0.01);
  const height = Math.max(maxY - minY, 0.01);
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  return { minX, maxX, minY, maxY, width, height, centerX, centerY };
}

/**
 * Normalizes landmarks to be translation- and scale-invariant.
 * Centered around the torso center (midpoint between shoulders and hips).
 * Scaled by torso height or torso diagonal to eliminate camera distance discrepancies.
 */
export function normalizeLandmarks(landmarks: Landmark[], isMirrored: boolean = false): Landmark[] {
  if (!landmarks || landmarks.length === 0) return [];

  // If front camera mirrored selfie, flip X coordinates
  const workingLandmarks = landmarks.map(lm => ({
    ...lm,
    x: isMirrored ? 1 - lm.x : lm.x,
  }));

  const leftShoulder = workingLandmarks[PoseLandmarkIndex.LEFT_SHOULDER];
  const rightShoulder = workingLandmarks[PoseLandmarkIndex.RIGHT_SHOULDER];
  const leftHip = workingLandmarks[PoseLandmarkIndex.LEFT_HIP];
  const rightHip = workingLandmarks[PoseLandmarkIndex.RIGHT_HIP];

  let center = { x: 0.5, y: 0.5 };
  let scale = 1.0;

  // If we have reliable torso anchors, use torso reference frame
  if (
    isLandmarkReliable(leftShoulder) &&
    isLandmarkReliable(rightShoulder) &&
    isLandmarkReliable(leftHip) &&
    isLandmarkReliable(rightHip)
  ) {
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;

    center = {
      x: (shoulderMidX + hipMidX) / 2,
      y: (shoulderMidY + hipMidY) / 2,
    };

    // Torso length as standard unit of scale
    const torsoDist = Math.hypot(shoulderMidX - hipMidX, shoulderMidY - hipMidY);
    scale = torsoDist > 0.05 ? torsoDist : 0.25;
  } else {
    // Fallback: use overall bounding box
    const bbox = getLandmarkBoundingBox(workingLandmarks);
    center = { x: bbox.centerX, y: bbox.centerY };
    scale = Math.max(bbox.height, 0.2);
  }

  return workingLandmarks.map(lm => ({
    ...lm,
    x: (lm.x - center.x) / scale,
    y: (lm.y - center.y) / scale,
  }));
}
