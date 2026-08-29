const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeEmail,
  buildStudentRegistrationPayload,
  hashActivationToken,
  createActivationToken,
} = require('../src/utils/studentRegistration');

test('normalizeEmail lowercases and trims email', () => {
  assert.equal(normalizeEmail('  USER@Example.com  '), 'user@example.com');
});

test('registration payload always forces role to student and hides admin/mentor input', () => {
  const payload = buildStudentRegistrationPayload({
    name: 'Ada L.',
    email: ' ADA@Example.com ',
    password: 'P@ssword123',
    role: 'admin',
  });

  assert.equal(payload.role, 'student');
  assert.equal(payload.email, 'ada@example.com');
});

test('activation token hash is deterministic for a given raw token', () => {
  const token = 'token-123';
  assert.equal(hashActivationToken(token), hashActivationToken(token));
  assert.notEqual(hashActivationToken(token), hashActivationToken('token-456'));
});

test('createActivationToken generates a random opaque token, expiry window, and activation link', () => {
  const result = createActivationToken('http://localhost:5173');

  assert.ok(result.rawToken && result.rawToken.length >= 32);
  assert.ok(result.hash && result.hash.length > 20);
  assert.ok(result.expiresAt instanceof Date);
  assert.ok(result.expiresAt.getTime() > Date.now());
  assert.match(result.activationUrl, /^http:\/\/localhost:5173\/activate-account\?token=/);
});
