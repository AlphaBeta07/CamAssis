import { Landmark } from '../types';

/**
 * Creates a simulated user posture based on reference landmarks with added delta/noise,
 * allowing live testing of the pose matching engine on any simulator or device.
 */
export function generateSimulatedUserLandmarks(
  referenceLandmarks: Landmark[],
  alignmentPercentage: number = 0.75,
  jitter: number = 0.02
): Landmark[] {
  if (!referenceLandmarks || referenceLandmarks.length === 0) return [];

  // An alignment of 1.0 means exact match, 0.5 means deviated
  const deviation = (1.0 - alignmentPercentage) * 0.15;

  return referenceLandmarks.map((lm, idx) => {
    // Some joints deviate more when not aligned (wrists, elbows, knees)
    const isLimb = idx >= 13 && idx <= 22;
    const limbFactor = isLimb ? 1.6 : 1.0;

    const noiseX = (Math.random() - 0.5) * jitter + deviation * limbFactor * (idx % 2 === 0 ? 1 : -1);
    const noiseY = (Math.random() - 0.5) * jitter + deviation * limbFactor * (idx % 3 === 0 ? -1 : 1);

    return {
      x: Math.min(1, Math.max(0, lm.x + noiseX)),
      y: Math.min(1, Math.max(0, lm.y + noiseY)),
      z: lm.z,
      visibility: Math.min(1, Math.max(0.6, (lm.visibility || 0.9) - Math.random() * 0.1)),
    };
  });
}
