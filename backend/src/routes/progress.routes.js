const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  updateProgress,
  getProgress,
  getProgressSummary,
} = require("../controllers/progress.controller");

const {
  updateProgressSchema,
} = require("../validators/progress.validator");

// Protect all progress routes
router.use(protect);

// ======================================================
// MENTOR: Create or update student progress
// ======================================================
router.put(
  "/",
  authorize("mentor"),
  validate(updateProgressSchema),
  updateProgress,
);

// ======================================================
// ADMIN / MENTOR / STUDENT: Get progress
// ======================================================
router.get(
  "/",
  authorize("admin", "mentor", "student"),
  getProgress,
);

// ======================================================
// ADMIN / MENTOR / STUDENT: Get progress summary
// ======================================================
router.get(
  "/summary/:studentId",
  authorize("admin", "mentor", "student"),
  getProgressSummary,
);

module.exports = router;