const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

// All notification routes require the user to be logged in.
router.use(protect);

// Get the current user's notifications.
router.get("/", getMyNotifications);

// Get the current user's unread notification count.
router.get("/unread-count", getUnreadCount);

// Mark one notification as read.
router.put("/:id/read", markAsRead);

// Mark all notifications as read.
router.put("/read-all", markAllAsRead);

module.exports = router;
