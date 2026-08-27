const crypto = require('crypto');

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

const generateResetToken = () => {
  const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  return { rawToken, hashedToken, expiresAt };
};

const hashResetToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

module.exports = { generateResetToken, hashResetToken };
