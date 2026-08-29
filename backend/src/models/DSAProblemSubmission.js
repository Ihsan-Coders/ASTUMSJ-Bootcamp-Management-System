const mongoose = require("mongoose");

const dsaProblemSubmissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    problemLink: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["Codeforces", "LeetCode"],
      required: true,
      index: true,
    },

    timeTakenMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 1440,
    },

    solutionUrl: {
      type: String,
      required: true,
      trim: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

dsaProblemSubmissionSchema.index({
  student: 1,
  submittedAt: -1,
});

module.exports = mongoose.model(
  "DSAProblemSubmission",
  dsaProblemSubmissionSchema,
);
