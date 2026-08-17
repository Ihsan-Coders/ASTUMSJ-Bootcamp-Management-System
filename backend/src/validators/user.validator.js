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

module.exports = {
  createUserSchema,
  updateUserSchema,
};