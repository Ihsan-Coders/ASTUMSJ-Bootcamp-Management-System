const Notification = require("../models/Notification");

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

// Example future usage (M3 will call this when a submission is graded):
// await createNotification({
//   userId: submission.student,
//   type: 'GradePosted',
//   message: `Your submission for "${assignment.title}" has been graded.`,
//   relatedId: submission._id,
// });

module.exports = { createNotification };
