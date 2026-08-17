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
router.use(protect);
router.post("/", authorize("admin", "mentor"), createAnnouncement);
router.get("/", getAnnouncements);
router.put("/:id", authorize("admin", "mentor"), updateAnnouncement);
router.delete("/:id", authorize("admin", "mentor"), deleteAnnouncement);
module.exports = router;
