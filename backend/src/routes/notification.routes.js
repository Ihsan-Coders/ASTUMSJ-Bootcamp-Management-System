const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

// All notification routes require the user to be logged in.
router.use(protect);

// Get the current user's notifications.
router.get("/", getMyNotifications);

// Mark one notification as read.
router.put("/:id/read", markAsRead);

// Mark all notifications as read.
router.put("/read-all", markAllAsRead);

module.exports = router;
