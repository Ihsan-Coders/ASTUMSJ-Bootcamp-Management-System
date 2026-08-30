const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const {
  createBatch, getBatches, getOpenBatches, updateBatch, deleteBatch,
  assignMentorToBatch, enrollStudentInBatch, assignMentorToStudent, setAcceptingBatch,
} = require('../controllers/batch.controller');
const validate = require('../middleware/validate.middleware');
const { createBatchSchema, updateBatchSchema } = require('../validators/batch.validator');

router.get("/open", getOpenBatches); // public — RegisterForm needs this, no login required
router.use(protect);
router.get('/', authorize('admin', 'mentor'), getBatches);
router.post('/', authorize('admin'), validate(createBatchSchema), createBatch);
router.put('/:id', authorize('admin'),validate(updateBatchSchema), updateBatch);
router.delete('/:id', authorize('admin'), deleteBatch);
router.post('/assign-mentor', authorize('admin'), assignMentorToBatch);
router.post('/enroll-student', authorize('admin'), enrollStudentInBatch);
router.post('/assign-mentor-to-student', authorize('admin'), assignMentorToStudent);
router.put('/:id/set-accepting', authorize('admin'), setAcceptingBatch);

module.exports = router;
