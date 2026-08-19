const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const {
  getAdminDashboard, getMentorDashboard, getStudentDashboard,
} = require('../controllers/dashboard.controller');

const notYetImplemented = (name) => (req, res) => {
  res.status(501).json({
    success: false,
    data: null,
    message: `${name} is not implemented yet`,
  });
};

router.use(protect);
router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/mentor', authorize('mentor'), getMentorDashboard || notYetImplemented('getMentorDashboard'));
router.get('/student', authorize('student'), getStudentDashboard || notYetImplemented('getStudentDashboard'));

module.exports = router;
