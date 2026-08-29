const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getPublicDashboard,
  getPublicMentors,
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
} = require("../controllers/dashboard.controller");

router.get("/public", getPublicDashboard);
router.get("/public/mentors", getPublicMentors);

router.get("/admin", protect, authorize("admin"), getAdminDashboard);

router.get("/mentor", protect, authorize("mentor"), getMentorDashboard);

router.get("/student", protect, authorize("student"), getStudentDashboard);

module.exports = router;
