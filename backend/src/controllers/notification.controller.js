const Notification = require("../models/Notification");
const asyncHandler = require('../utils/asyncHandler');

// Get all notifications belonging to the currently logged-in user
const getMyNotifications = asyncHandler(async (req, res) => {
    // Find notifications where the user is the logged-in user.
    // Newest notifications are returned first. Capped to the most
    // recent 50 so the feed stays fast as history grows.
    const notifications = await Notification.find({ user: req.user.id })
      .sort({
        createdAt: -1,
      })
      .limit(50);

    res.status(200).json({
      success: true,
      data: notifications,
      message: "Notifications fetched",
    });
})

// Get the unread notification count for the currently logged-in user.
// Kept separate from getMyNotifications (which is capped to 50) so the
// badge count stays accurate even if a user has more unread items than
// the capped list would show.
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: { count },
      message: "Unread count fetched",
    });
})

// Mark one notification as read
const markAsRead = asyncHandler(async (req, res) => {
    // Find the notification by its ID.
    // The notification must also belong to the logged-in user.
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    // If the notification doesn't exist or doesn't belong
    // to this user, return 404.
    if (!notification) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
      message: "Marked as read",
    });
  
})

// Mark all notifications of the logged-in user as read
const markAllAsRead = asyncHandler(async (req, res) => {
    // Find all unread notifications belonging to this user
    // and change isRead from false to true.
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res.status(200).json({
      success: true,
      data: null,
      message: "All marked as read",
    });
})

// Export the controller functions so the routes can use them.
module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
