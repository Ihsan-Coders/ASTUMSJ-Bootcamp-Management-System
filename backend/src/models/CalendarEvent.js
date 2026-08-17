const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["AssignmentDeadline", "Session", "Custom"],
      required: true,
    },
    date: { type: Date, required: true },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    relatedAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
