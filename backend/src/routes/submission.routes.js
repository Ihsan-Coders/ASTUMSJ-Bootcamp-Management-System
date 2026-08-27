const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const verifyFileSignature = require('../middleware/verifyFileSignature.middleware');
const { createSubmission,updateSubmission, gradeSubmission, getSubmissions } = require('../controllers/submission.controller');

router.use(protect);
router.post('/', authorize('student'), upload.array('attachments', 3), verifyFileSignature, createSubmission);
router.put('/:id',authorize('student'),upload.array('attachments', 3),verifyFileSignature,updateSubmission);
router.put('/:id/grade', authorize('mentor'), gradeSubmission);
router.get('/', authorize('admin', 'mentor', 'student'), getSubmissions);

module.exports = router;
