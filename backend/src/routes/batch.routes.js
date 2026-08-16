const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const {
  createBatch, getBatches, updateBatch, deleteBatch,
  assignMentorToBatch, enrollStudentInBatch,
} = require('../controllers/batch.controller');

router.use(protect); // all batch routes require login

router.get('/', authorize('admin', 'mentor'), getBatches);
router.post('/', authorize('admin'), createBatch);
router.put('/:id', authorize('admin'), updateBatch);
router.delete('/:id', authorize('admin'), deleteBatch);
router.post('/assign-mentor', authorize('admin'), assignMentorToBatch);
router.post('/enroll-student', authorize('admin'), enrollStudentInBatch);

module.exports = router;
