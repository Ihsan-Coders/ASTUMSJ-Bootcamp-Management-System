const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const validateObjectId = require('../middleware/validateObjectId.middleware');

const {
  submitApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  assignMentor,
  getMyAssignedApplicants,
  submitInterviewResult,
  finalDecision,
} = require('../controllers/application.controller');

const {
  createApplicationSchema,
  assignMentorSchema,
  interviewResultSchema,
  finalDecisionSchema,
} = require('../validators/application.validator');

// Public — the bootcamp registration form.
router.post('/', validate(createApplicationSchema), submitApplication);

// Everything below requires authentication.
router.use(protect);

// Mentor — restricted to applicants assigned to that mentor (enforced in
// the controller via req.user.id, never a client-supplied mentor id).
router.get('/assigned/mine', authorize('mentor'), getMyAssignedApplicants);
router.put(
  '/:id/interview-result',
  authorize('mentor'),
  validateObjectId,
  validate(interviewResultSchema),
  submitInterviewResult,
);

// Admin — full application management.
router.get('/', authorize('admin'), getApplications);
router.get('/:id', authorize('admin'), validateObjectId, getApplicationById);
router.put('/:id/approve', authorize('admin'), validateObjectId, approveApplication);
router.put('/:id/reject', authorize('admin'), validateObjectId, rejectApplication);
router.put(
  '/:id/assign-mentor',
  authorize('admin'),
  validateObjectId,
  validate(assignMentorSchema),
  assignMentor,
);
router.put(
  '/:id/final-decision',
  authorize('admin'),
  validateObjectId,
  validate(finalDecisionSchema),
  finalDecision,
);

module.exports = router;
