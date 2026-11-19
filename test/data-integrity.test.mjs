import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Database & Seed Data Integrity', () => {
  const seedPath = path.resolve('supabase/seed.sql');
  const seedContent = fs.readFileSync(seedPath, 'utf8');

  it('contains strictly valid hexadecimal UUIDs across all table insertions', () => {
    // Standard RFC4122 UUID regex: 8-4-4-4-12 hex characters
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;
    
    // Find all single-quoted identifiers matching UUID format or potential malformed ones
    const quotedIds = seedContent.match(/'[a-zA-Z0-9-]{36}'/g) || [];
    assert.ok(quotedIds.length > 0, 'Should have UUIDs in seed.sql');

    for (const quoted of quotedIds) {
      const raw = quoted.replace(/'/g, '');
      const isHexValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(raw);
      assert.ok(isHexValid, `UUID "${raw}" must contain only hexadecimal digits [0-9a-fA-F]`);
    }
  });

  it('guarantees seed.sql contains all core tables', () => {
    assert.ok(seedContent.includes('INSERT INTO public.categories'), 'Must seed categories');
    assert.ok(seedContent.includes('INSERT INTO public.collections'), 'Must seed collections');
    assert.ok(seedContent.includes('INSERT INTO public.poses'), 'Must seed poses');
    assert.ok(seedContent.includes('INSERT INTO public.pose_landmarks'), 'Must seed pose_landmarks');
  });

  it('verifies 33 MediaPipe landmark points are seeded per pose', () => {
    const landmarkJsonMatches = seedContent.match(/'\[\{"x":.+?\}\]'::jsonb/g) || [];
    assert.ok(landmarkJsonMatches.length >= 10, 'Should have at least 10 seeded poses with landmarks');

    for (const match of landmarkJsonMatches) {
      const jsonStr = match.replace(/^'/, '').replace(/'::jsonb$/, '');
      const parsed = JSON.parse(jsonStr);
      assert.equal(parsed.length, 33, 'Each pose landmark set must contain exactly 33 MediaPipe points');
      for (const pt of parsed) {
        assert.ok(typeof pt.x === 'number' && pt.x >= 0 && pt.x <= 1, 'x coordinate must be between 0 and 1');
        assert.ok(typeof pt.y === 'number' && pt.y >= 0 && pt.y <= 1, 'y coordinate must be between 0 and 1');
        assert.ok(typeof pt.visibility === 'number' && pt.visibility >= 0 && pt.visibility <= 1, 'visibility must be valid');
      }
    }
  });
});
