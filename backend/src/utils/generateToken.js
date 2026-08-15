const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {id: userId.toString(),
    role,},process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      issuer: 'astu-msj-bootcamp',
    }
  );
};

module.exports = generateToken;