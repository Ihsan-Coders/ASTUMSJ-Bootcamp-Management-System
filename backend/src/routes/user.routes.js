const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const {getUsers, createUser, updateUser, deleteUser,
    getPendingUsers, approveUser, rejectUser,
    } = require('../controllers/user.controller');
const validateObjectId = require('../middleware/validateObjectId.middleware');
const validate = require('../middleware/validate.middleware');
const {createUserSchema,updateUserSchema,} = require('../validators/user.validator');

router.use(protect, authorize('admin'));
router.get('/', getUsers);
router.post('/',validate(createUserSchema), createUser);
router.get('/pending', getPendingUsers);
router.put('/:id',validateObjectId,validate(updateUserSchema), updateUser);
router.put('/:id/approve',validateObjectId, approveUser);
router.delete('/:id/reject',validateObjectId, rejectUser);
router.delete('/:id',validateObjectId, deleteUser);

module.exports = router;
