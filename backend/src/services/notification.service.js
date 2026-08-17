const Notification = require("../models/Notification");

// Creates and saves a notification for a user
const createNotification = async ({ userId, type, message, relatedId }) => {
  try {
    return await Notification.create({
      user: userId,
      type,
      message,
      relatedId,
    });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

module.exports = { createNotification };
