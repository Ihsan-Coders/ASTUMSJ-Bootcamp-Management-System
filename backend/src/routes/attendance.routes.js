const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  markAttendance,
  markBulkAttendance,
  updateAttendance,
  getAttendanceHistory,
  deleteAttendance,
} = require("../controllers/attendance.controller");

router.use(protect);

// Admin attendance management
router.post("/", authorize("admin"), markAttendance);

router.post(
  "/bulk",
  authorize("admin"),
  markBulkAttendance,
);

router.put(
  "/:id",
  authorize("admin"),
  updateAttendance,
);

router.delete(
  "/:id",
  authorize("admin"),
  deleteAttendance,
);
// Admin / Mentor / Student attendance viewing
router.get(
  "/",
  authorize("admin", "mentor", "student"),
  getAttendanceHistory,
);

module.exports = router;