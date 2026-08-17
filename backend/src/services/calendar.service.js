const CalendarEvent = require("../models/CalendarEvent");
const syncAssignmentDeadline = async (assignment) => {
  try {
    await CalendarEvent.findOneAndUpdate(
      { relatedAssignment: assignment._id },
      {
        title: `Deadline: ${assignment.title}`,
        type: "AssignmentDeadline",
        date: assignment.deadline,
        batch: assignment.batch,
        relatedAssignment: assignment._id,
      },
      { upsert: true, new: true },
    );
  } catch (err) {
    console.error("Failed to sync calendar event:", err.message);
  }
};

module.exports = { syncAssignmentDeadline };
