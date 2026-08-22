const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  markAttendance,
  updateAttendance,
  getAttendanceHistory,
  deleteAttendance,
} = require("../controllers/attendance.controller");

router.use(protect);

router.post("/", authorize("mentor"), markAttendance);

router.put("/:id", authorize("mentor"), updateAttendance);

router.get("/", authorize("admin", "mentor", "student"), getAttendanceHistory);

router.delete("/:id", authorize("mentor"), deleteAttendance);

module.exports = router;
