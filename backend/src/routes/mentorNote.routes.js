const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const {
  createNote,
  getNotesForStudent,
} = require("../controllers/mentorNote.controller");
router.use(protect, authorize("admin", "mentor")); // students can NEVER access this route
router.post("/", createNote);
router.get("/:studentId", getNotesForStudent);
module.exports = router;
