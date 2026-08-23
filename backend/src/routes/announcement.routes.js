const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const validateObjectId = require("../middleware/validateObjectId.middleware");

const {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} = require("../validators/announcement.validator");

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

// Every announcement route requires authentication
router.use(protect);

// Admins and mentors can create announcements
router.post(
  "/",
  authorize("admin", "mentor"),
  validate(createAnnouncementSchema),
  createAnnouncement,
);

// Authenticated users can read announcements (scoped per-role in the controller)
router.get("/", getAnnouncements);

// Admins and mentors can update announcements (ownership enforced in controller)
router.put(
  "/:id",
  authorize("admin", "mentor"),
  validateObjectId,
  validate(updateAnnouncementSchema),
  updateAnnouncement,
);

// Admins and mentors can delete announcements (ownership enforced in controller)
router.delete(
  "/:id",
  authorize("admin", "mentor"),
  validateObjectId,
  deleteAnnouncement,
);

module.exports = router;
