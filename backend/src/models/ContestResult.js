const mongoose = require("mongoose");

const contestResultSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    codeforcesHandle: {
      type: String,
      required: true,
      trim: true,
    },

    rank: {
      type: Number,
      default: null,
    },

    points: {
      type: Number,
      default: 0,
    },

    problemsSolved: {
      type: Number,
      default: 0,
    },

    solvedProblemIndexes: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "Fetched",
        "NotParticipated",
        "NoHandle",
        "InvalidHandle",
        "ApiUnavailable",
      ],
      default: "Fetched",
    },

    fetchedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  },
);

// One result per student per contest
contestResultSchema.index(
  {
    contest: 1,
    student: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("ContestResult", contestResultSchema);
