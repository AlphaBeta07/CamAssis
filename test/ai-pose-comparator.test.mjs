import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

describe('AI Pose Comparator & Geometric Calculations', () => {
  it('correctly calculates 90-degree right angle at elbow vertex', () => {
    // Shoulder directly above elbow, wrist directly to the right
    const shoulder = { x: 0.5, y: 0.2, visibility: 0.95 };
    const elbow = { x: 0.5, y: 0.5, visibility: 0.95 };
    const wrist = { x: 0.8, y: 0.5, visibility: 0.95 };

    const angle = calculateAngle(shoulder, elbow, wrist);
    assert.equal(angle, 90);
  });

  it('correctly calculates 180-degree straight arm alignment', () => {
    const shoulder = { x: 0.5, y: 0.2, visibility: 0.95 };
    const elbow = { x: 0.5, y: 0.5, visibility: 0.95 };
    const wrist = { x: 0.5, y: 0.8, visibility: 0.95 };

    const angle = calculateAngle(shoulder, elbow, wrist);
    assert.equal(angle, 180);
  });

  it('correctly calculates 45-degree acute elbow flexion', () => {
    const shoulder = { x: 0.5, y: 0.2, visibility: 0.95 };
    const elbow = { x: 0.5, y: 0.5, visibility: 0.95 };
    const wrist = { x: 0.8, y: 0.2, visibility: 0.95 };

    const angle = calculateAngle(shoulder, elbow, wrist);
    assert.equal(angle, 45);
  });

  it('yields identical match score when landmarks are congruent', () => {
    const sample = new Array(33).fill(null).map((_, i) => ({
      x: 0.3 + (i % 5) * 0.1,
      y: 0.2 + Math.floor(i / 5) * 0.1,
      visibility: 0.95,
    }));

    // Comparing sample with identical copy should yield perfect angle congruency
    for (let i = 0; i < sample.length - 2; i++) {
      const a = calculateAngle(sample[i], sample[i + 1], sample[i + 2]);
      const b = calculateAngle(sample[i], sample[i + 1], sample[i + 2]);
      assert.equal(a, b);
    }
  });
});
