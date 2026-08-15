const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, 12);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {hashPassword,comparePassword, };