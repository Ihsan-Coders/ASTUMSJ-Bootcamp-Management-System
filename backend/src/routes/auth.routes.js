const express = require('express');
const router = express.Router();

const { register, login, logout, forgotPassword, resetPassword, activateAccount } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

const { authLimiter, registrationLimiter, loginLimiter, activationLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, activateSchema } = require('../validators/auth.validator');

// public route
router.post('/register', registrationLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/activate', activationLimiter, validate(activateSchema), activateAccount);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

// protected route
router.post('/logout', protect, logout);

module.exports = router;