const Notification = require("../models/Notification");

// Get all notifications belonging to the currently logged-in user
const getMyNotifications = async (req, res) => {
  try {
    // Find notifications where the user is the logged-in user.
    // Newest notifications are returned first.
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: notifications,
      message: "Notifications fetched",
    });
  } catch (err) {
    // If something goes wrong, return a server error.
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Mark all notifications of the logged-in user as read
const markAllAsRead = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Export the controller functions so the routes can use them.
module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
