const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const validateObjectId = require('../middleware/validateObjectId.middleware');

const {
  getInterviewQuestions,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
} = require('../controllers/interviewQuestion.controller');

const {
  createInterviewQuestionSchema,
  updateInterviewQuestionSchema,
} = require('../validators/interviewQuestion.validator');

router.use(protect);

// Mentor needs to read the current question list to conduct an interview.
router.get('/', authorize('admin', 'mentor'), getInterviewQuestions);

// Only admin manages the list itself.
router.post('/', authorize('admin'), validate(createInterviewQuestionSchema), createInterviewQuestion);
router.put(
  '/:id',
  authorize('admin'),
  validateObjectId,
  validate(updateInterviewQuestionSchema),
  updateInterviewQuestion,
);
router.delete('/:id', authorize('admin'), validateObjectId, deleteInterviewQuestion);

module.exports = router;
