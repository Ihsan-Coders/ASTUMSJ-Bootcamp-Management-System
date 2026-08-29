const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "mentor", "student"],
      default: "student",
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicationStatus: {
      type: String,
      enum: [
        "pending",
        "rejected",
        "interview_scheduled",
        "interview_passed",
        "interview_failed",
        "approved",
        "activated",
      ],
      default: "pending",
      index: true,
    },

    interviewDate: { type: Date, default: null },
    interviewTime: { type: String, trim: true, default: null },
    interviewLocation: { type: String, trim: true, default: null },
    interviewLink: { type: String, trim: true, default: null },
    interviewNotes: { type: String, trim: true, default: null },
    interviewResult: { type: String, enum: ["passed", "failed", null], default: null },
    applicationReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    applicationRejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    applicationApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    interviewScheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    interviewResultRecordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    finalApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    activatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    activationTokenHash: {
      type: String,
      select: false,
      default: null,
    },
    activationTokenExpires: {
      type: Date,
      select: false,
      default: null,
    },
    activationTokenUsed: {
      type: Boolean,
      select: false,
      default: false,
    },

    codeforcesHandle: {
      type: String,
      trim: true,
      default: "",
    },
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
