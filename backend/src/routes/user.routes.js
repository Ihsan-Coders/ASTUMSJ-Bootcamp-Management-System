const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');

router.use(protect, authorize('admin')); // admin-only for all user management

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
