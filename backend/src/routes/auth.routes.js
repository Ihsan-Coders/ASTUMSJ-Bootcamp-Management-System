const express = require('express');
const router = express.Router();

const {register,login,logout } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

const {authLimiter} = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {registerSchema,loginSchema,} = require('../validators/auth.validator');

//public route
router.post('/register', authLimiter,validate(registerSchema),  register);
router.post('/login', authLimiter,validate(loginSchema), login);

//protected route
router.post('/logout', protect, logout);

module.exports = router;