const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const {
  getMe,
  updateMe,
  changePassword,
  getUsers,
  createUser,
  createMentor,
  updateUser,
  deleteUser,
  getPendingUsers,
  approveUser,
  rejectUser,
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
router.post('/',validate(createUserSchema), createUser);
router.post('/mentors', validate(createUserSchema), createMentor);
router.get('/pending', getPendingUsers);
router.put('/:id',validateObjectId,validate(updateUserSchema), updateUser);
router.put('/:id/approve',validateObjectId, approveUser);
router.delete('/:id/reject',validateObjectId, rejectUser);
router.delete('/:id',validateObjectId, deleteUser);

module.exports = router;
