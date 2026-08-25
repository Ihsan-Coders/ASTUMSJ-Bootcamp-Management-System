const Joi = require('joi');
const { strongPassword } = require('./password.rules');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: strongPassword,
});
const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email(),
  batch: Joi.string().hex().length(24).allow(null),
}).min(1);

const updateMeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email(),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),

  newPassword: strongPassword.messages({
      'string.min': 'New password must be at least 8 characters',
    }),
}).custom((value, helpers) => {
  if (value.currentPassword === value.newPassword) {
    return helpers.message(
      'New password must be different from the current password'
    );
  }

  return value;
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateMeSchema,
  changePasswordSchema,
};