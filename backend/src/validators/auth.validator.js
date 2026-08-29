const Joi = require('joi');
const { strongPassword } = require('./password.rules');

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: strongPassword,
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(254)
    .required(),

  password: Joi.string()
    .required(),
}).unknown(false);

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),
}).unknown(false);

const resetPasswordSchema = Joi.object({
  password: strongPassword,
}).unknown(false);

const activateSchema = Joi.object({
  token: Joi.string().trim().min(16).required(),
  password: strongPassword,
}).unknown(false);

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  activateSchema,
};