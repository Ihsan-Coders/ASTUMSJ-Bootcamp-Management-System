const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const {
  getMe,
  updateMe,
  changePassword,
  getUsers,
  getUserById,
  createUser,
  createMentor,
  createAdmin,
  updateUser,
  deleteUser,
  getPendingUsers,
  approveUser,
  rejectUser,
  scheduleInterview,
  recordInterviewResult,
  finalApproveUser,
} = require('../controllers/user.controller');
const validateObjectId = require('../middleware/validateObjectId.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createUserSchema,
  updateUserSchema,
  updateMeSchema,
  changePasswordSchema,
} = require('../validators/user.validator');

// Every route below requires authentication.
router.use(protect);

// Self-service profile — any authenticated role (admin, mentor, student).
// Registered before the admin-only gate below so it isn't blocked by it.
router.get('/me', getMe);
router.put('/me', validate(updateMeSchema), updateMe);
router.put('/me/password',validate(changePasswordSchema),changePassword);

// Everything past this point is admin-only.
router.use(authorize('admin'));
router.get('/', getUsers);
router.get('/pending', getPendingUsers);
router.get('/:id', validateObjectId, getUserById);
router.post('/',validate(createUserSchema), createUser);
router.post('/mentors', validate(createUserSchema), createMentor);
router.post('/admins', validate(createUserSchema), createAdmin);
router.put('/:id',validateObjectId,validate(updateUserSchema), updateUser);
router.patch('/:id/approve',validateObjectId, approveUser);
router.put('/:id/approve',validateObjectId, approveUser);
router.patch('/:id/reject',validateObjectId, rejectUser);
router.put('/:id/reject',validateObjectId, rejectUser);
router.patch('/:id/schedule-interview', validateObjectId, scheduleInterview);
router.put('/:id/schedule-interview', validateObjectId, scheduleInterview);
router.patch('/:id/interview-result', validateObjectId, recordInterviewResult);
router.put('/:id/interview-result', validateObjectId, recordInterviewResult);
router.patch('/:id/final-approve', validateObjectId, finalApproveUser);
router.put('/:id/final-approve', validateObjectId, finalApproveUser);
router.delete('/:id',validateObjectId, deleteUser);

module.exports = router;
