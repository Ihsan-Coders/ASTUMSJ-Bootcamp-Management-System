const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
} = require("../controllers/dashboard.controller");

router.use(protect);

router.get("/admin", authorize("admin"), getAdminDashboard);
router.get("/mentor", authorize("mentor"), getMentorDashboard);
router.get("/student", authorize("student"), getStudentDashboard);

module.exports = router;