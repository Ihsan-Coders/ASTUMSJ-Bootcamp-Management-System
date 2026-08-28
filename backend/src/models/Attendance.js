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

// A student can only have one attendance record
// for each checkpoint of a particular day.
attendanceSchema.index(
  { student: 1, batch: 1, date: 1, session: 1 },
  { unique: true },
);

module.exports = mongoose.model("Attendance", attendanceSchema);