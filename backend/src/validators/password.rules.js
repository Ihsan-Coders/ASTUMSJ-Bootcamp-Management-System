const Joi = require('joi');

const strongPassword = Joi.string()
  .min(8)
  .max(128)
  .required()
  .custom((value, helpers) => {
    const missing = [];
    if (!/[a-z]/.test(value)) missing.push('one lowercase letter');
    if (!/[A-Z]/.test(value)) missing.push('one uppercase letter');
    if (!/\d/.test(value)) missing.push('one number');
    if (!/[^A-Za-z0-9]/.test(value)) missing.push('one special character');

    if (missing.length > 0) {
      return helpers.message(`Password must include at least ${missing.join(', ')}`);
    }
    return value;
  })
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 128 characters',
  });

module.exports = { strongPassword };
