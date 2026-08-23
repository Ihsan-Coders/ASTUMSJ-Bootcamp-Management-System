const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email(),
  batch: Joi.string().hex().length(24).allow(null),
}).min(1);

// Self-service "my profile" update. Deliberately excludes role, batch,
// isActive (approval status) and password — those are admin-controlled or
// have their own dedicated flows.
const updateMeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email(),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),

  newPassword: Joi.string()
    .min(8)
    .required()
    .messages({
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