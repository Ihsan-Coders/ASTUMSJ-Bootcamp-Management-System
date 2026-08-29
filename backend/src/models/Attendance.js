const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    // The exact scheduled class/session this attendance belongs to.
    calendarEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CalendarEvent",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    session: {
      type: String,
      enum: ["start", "end"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// One student can have only one start/end attendance
// record for a specific scheduled calendar session.
attendanceSchema.index(
  {
    student: 1,
    calendarEvent: 1,
    session: 1,
  },
  { unique: true },
);

module.exports = mongoose.model("Attendance", attendanceSchema);