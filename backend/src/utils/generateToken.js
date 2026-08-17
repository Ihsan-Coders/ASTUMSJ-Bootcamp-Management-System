const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {sub: userId.toString(),},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      algorithm: 'HS256',issuer: 'astumsj-bootcamp',
      audience: 'astumsj-users',
    });
};

module.exports = generateToken;