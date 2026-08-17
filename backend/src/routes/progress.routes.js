const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
  updateProgress,
  getProgress,
  getProgressSummary
} = require('../controllers/progress.controller');

const {
  updateProgressSchema
} = require('../validators/progress.validator');


// Protect all progress routes
router.use(protect);


// Mentor updates student progress
router.put(
  '/',
  authorize('mentor'),
  validate(updateProgressSchema),
  updateProgress
);


// Admin, mentor and student view progress
router.get(
  '/',
  authorize('admin', 'mentor', 'student'),
  getProgress
);


// Get calculated progress summary
router.get(
  '/summary/:studentId',
  authorize('admin', 'mentor', 'student'),
  getProgressSummary
);


module.exports = router;