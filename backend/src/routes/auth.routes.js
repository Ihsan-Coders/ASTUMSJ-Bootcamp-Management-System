const express = require('express');
const router = express.Router();

const {register,login,logout, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

const {authLimiter} = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {registerSchema,loginSchema,forgotPasswordSchema,resetPasswordSchema} = require('../validators/auth.validator');

//public route
router.post('/register', authLimiter,validate(registerSchema),  register);
router.post('/login', authLimiter,validate(loginSchema), login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

//protected route
router.post('/logout', protect, logout);

module.exports = router;