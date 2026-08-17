const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

// Every announcement route requires authentication
router.use(protect);

// Admins and mentors can create announcements
router.post("/", authorize("admin", "mentor"), createAnnouncement);

// Authenticated users can read announcements
router.get("/", getAnnouncements);

// Admins and mentors can update announcements
router.put("/:id", authorize("admin", "mentor"), updateAnnouncement);

// Admins and mentors can delete announcements
router.delete("/:id", authorize("admin", "mentor"), deleteAnnouncement);

module.exports = router;
