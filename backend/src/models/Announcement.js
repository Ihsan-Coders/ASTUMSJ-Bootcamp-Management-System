const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    targetAudience: {
      type: String,
      enum: ["All", "Students", "Mentors", "SpecificBatch"],
      default: "All",
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    publishDate: {
      type: Date,
      default: Date.now,
    },

    // Whether this announcement represents a scheduled class/session.
    isSession: {
      type: Boolean,
      default: false,
    },

    // Scheduled date/time of the class.
    sessionDate: {
      type: Date,
      default: null,
    },

    // Calendar event created for this announcement.
    calendarEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CalendarEvent",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Announcement", announcementSchema);