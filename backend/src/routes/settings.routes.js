const express = require('express');
const router = express.Router();

const { getRegistrationStatus, updateRegistrationStatus } = require('../controllers/settings.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// Public: fetch registration status
router.get('/registration', getRegistrationStatus);

// Admin only: update registration status
router.put('/registration', protect, authorize('admin'), updateRegistrationStatus);

module.exports = router;
