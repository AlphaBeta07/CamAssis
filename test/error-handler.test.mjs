import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function sanitizeErrorMessage(rawMessage) {
  if (!rawMessage) return 'An unexpected error occurred.';
  let clean = rawMessage.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_TOKEN]');
  clean = clean.replace(/https:\/\/[a-zA-Z0-9.-]+\.supabase\.co/g, '[SUPABASE_ENDPOINT]');
  return clean;
}

describe('Error Handler Security & Sanitization', () => {
  it('strips JWT / Supabase auth tokens from error strings', () => {
    const raw = 'Auth error with token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThisPart in request';
    const clean = sanitizeErrorMessage(raw);
    assert.ok(!clean.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
    assert.ok(clean.includes('[REDACTED_TOKEN]'));
  });

  it('redacts internal project supabase urls from stack traces', () => {
    const raw = 'Failed to fetch from https://xyzproject.supabase.co/rest/v1/poses';
    const clean = sanitizeErrorMessage(raw);
    assert.ok(!clean.includes('https://xyzproject.supabase.co'));
    assert.ok(clean.includes('[SUPABASE_ENDPOINT]'));
  });

  it('handles empty or null error inputs gracefully', () => {
    assert.equal(sanitizeErrorMessage(''), 'An unexpected error occurred.');
    assert.equal(sanitizeErrorMessage(null), 'An unexpected error occurred.');
    assert.equal(sanitizeErrorMessage(undefined), 'An unexpected error occurred.');
  });
});
