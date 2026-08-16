const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const {
  createAssignment, getAssignments, updateAssignment, deleteAssignment,
} = require('../controllers/assignment.controller');

router.use(protect);
router.post('/', authorize('mentor'), createAssignment);
router.get('/', authorize('admin', 'mentor', 'student'), getAssignments);
router.put('/:id', authorize('mentor'), updateAssignment);
router.delete('/:id', authorize('mentor'), deleteAssignment);

module.exports = router;
