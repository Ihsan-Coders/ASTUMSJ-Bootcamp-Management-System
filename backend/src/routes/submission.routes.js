const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const { createSubmission, gradeSubmission, getSubmissions } = require('../controllers/submission.controller');

router.use(protect);
router.post('/', authorize('student'), upload.array('attachments', 3), createSubmission);
router.put('/:id/grade', authorize('mentor'), gradeSubmission);
router.get('/', authorize('admin', 'mentor', 'student'), getSubmissions);

module.exports = router;
