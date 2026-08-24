const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["AssignmentDeadline", "Session", "Custom"],
      required: true,
    },
    // Stores both date and time-of-day (datetime). The frontend uses a
    // single datetime-local input, so no separate "time" field is needed.
    date: { type: Date, required: true },
    // Optional: events with no batch are "global" and visible to every
    // student, mirroring the Assignment model's batch-targeting pattern.
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: false,
      default: null,
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
