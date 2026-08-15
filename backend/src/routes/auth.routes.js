const express = require('express');
const router = express.Router();

const {register,login,logout } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

const {authLimiter} = require('../middleware/rateLimiter.middleware');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);

module.exports = router;