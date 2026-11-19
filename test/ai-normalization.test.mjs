import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Core Landmark Indices (from MediaPipe)
const PoseLandmarkIndex = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

function isLandmarkReliable(lm) {
  return lm && typeof lm.x === 'number' && typeof lm.y === 'number' && (lm.visibility ?? 1) >= 0.5;
}

function getLandmarkBoundingBox(landmarks) {
  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  for (const lm of landmarks) {
    if (isLandmarkReliable(lm)) {
      if (lm.x < minX) minX = lm.x;
      if (lm.x > maxX) maxX = lm.x;
      if (lm.y < minY) minY = lm.y;
      if (lm.y > maxY) maxY = lm.y;
    }
  }
  if (minX > maxX) { minX = 0.2; maxX = 0.8; minY = 0.1; maxY = 0.9; }
  const width = Math.max(maxX - minX, 0.01);
  const height = Math.max(maxY - minY, 0.01);
  return { minX, maxX, minY, maxY, width, height, centerX: minX + width / 2, centerY: minY + height / 2 };
}

function normalizeLandmarks(landmarks, isMirrored = false) {
  if (!landmarks || landmarks.length === 0) return [];
  const working = landmarks.map(lm => ({
    ...lm,
    x: isMirrored ? 1 - lm.x : lm.x,
  }));

  const ls = working[PoseLandmarkIndex.LEFT_SHOULDER];
  const rs = working[PoseLandmarkIndex.RIGHT_SHOULDER];
  const lh = working[PoseLandmarkIndex.LEFT_HIP];
  const rh = working[PoseLandmarkIndex.RIGHT_HIP];

  let center = { x: 0.5, y: 0.5 };
  let scale = 1.0;

  if (isLandmarkReliable(ls) && isLandmarkReliable(rs) && isLandmarkReliable(lh) && isLandmarkReliable(rh)) {
    const smX = (ls.x + rs.x) / 2;
    const smY = (ls.y + rs.y) / 2;
    const hmX = (lh.x + rh.x) / 2;
    const hmY = (lh.y + rh.y) / 2;

    center = { x: (smX + hmX) / 2, y: (smY + hmY) / 2 };
    const torsoDist = Math.hypot(smX - hmX, smY - hmY);
    scale = torsoDist > 0.05 ? torsoDist : 0.25;
  } else {
    const bbox = getLandmarkBoundingBox(working);
    center = { x: bbox.centerX, y: bbox.centerY };
    scale = Math.max(bbox.height, 0.2);
  }

  return working.map(lm => ({
    ...lm,
    x: (lm.x - center.x) / scale,
    y: (lm.y - center.y) / scale,
  }));
}

describe('AI Pose Normalization Engine', () => {
  it('correctly calculates bounding boxes for landmark distributions', () => {
    const sample = [
      { x: 0.2, y: 0.1, visibility: 0.95 },
      { x: 0.8, y: 0.9, visibility: 0.95 },
      { x: 0.5, y: 0.5, visibility: 0.95 },
    ];
    const bbox = getLandmarkBoundingBox(sample);
    assert.equal(bbox.minX, 0.2);
    assert.equal(bbox.maxX, 0.8);
    assert.equal(bbox.minY, 0.1);
    assert.equal(bbox.maxY, 0.9);
    assert.ok(Math.abs(bbox.width - 0.6) < 1e-6);
    assert.ok(Math.abs(bbox.height - 0.8) < 1e-6);
    assert.equal(bbox.centerX, 0.5);
    assert.equal(bbox.centerY, 0.5);
  });

  it('normalizes landmarks to translation-invariant coordinates around torso', () => {
    const raw = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));
    raw[PoseLandmarkIndex.LEFT_SHOULDER] = { x: 0.4, y: 0.3, visibility: 0.95 };
    raw[PoseLandmarkIndex.RIGHT_SHOULDER] = { x: 0.6, y: 0.3, visibility: 0.95 };
    raw[PoseLandmarkIndex.LEFT_HIP] = { x: 0.4, y: 0.7, visibility: 0.95 };
    raw[PoseLandmarkIndex.RIGHT_HIP] = { x: 0.6, y: 0.7, visibility: 0.95 };

    const normalized = normalizeLandmarks(raw);
    assert.equal(normalized.length, 33);

    // Torso center was (0.5, 0.5). A landmark at (0.5, 0.5) should map to (0, 0)
    const nose = normalized[PoseLandmarkIndex.NOSE];
    assert.ok(Math.abs(nose.x) < 0.001);
    assert.ok(Math.abs(nose.y) < 0.001);
  });

  it('handles front-camera mirroring correctly by flipping X coordinates', () => {
    const raw = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));
    raw[PoseLandmarkIndex.LEFT_SHOULDER] = { x: 0.3, y: 0.4, visibility: 0.95 };
    raw[PoseLandmarkIndex.RIGHT_SHOULDER] = { x: 0.7, y: 0.4, visibility: 0.95 };
    raw[PoseLandmarkIndex.LEFT_HIP] = { x: 0.3, y: 0.8, visibility: 0.95 };
    raw[PoseLandmarkIndex.RIGHT_HIP] = { x: 0.7, y: 0.8, visibility: 0.95 };

    const normal = normalizeLandmarks(raw, false);
    const mirrored = normalizeLandmarks(raw, true);

    // Mirrored X coordinates should be negated across the center
    assert.ok(Math.abs(normal[PoseLandmarkIndex.LEFT_SHOULDER].x + mirrored[PoseLandmarkIndex.LEFT_SHOULDER].x) < 0.001);
  });
});
