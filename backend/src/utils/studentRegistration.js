const crypto = require('crypto');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const hashActivationToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const createActivationToken = (baseUrl = process.env.CLIENT_URL || 'http://localhost:5173') => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const activationUrl = `${baseUrl.replace(/\/$/, '')}/activate-account?token=${rawToken}`;

  return {
    rawToken,
    hash: hashActivationToken(rawToken),
    expiresAt,
    activationUrl,
  };
};

const buildStudentRegistrationPayload = (payload = {}) => {
  const name = String(payload.name || '').trim();
  const email = normalizeEmail(payload.email);

  return {
    name,
    email,
    password: payload.password,
    role: 'student',
    isActive: false,
    applicationStatus: 'pending',
  };
};

module.exports = {
  normalizeEmail,
  buildStudentRegistrationPayload,
  hashActivationToken,
  createActivationToken,
};
