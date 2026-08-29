const mongoose = require("mongoose");
const contestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Contest name is required"],
      trim: true,
    },

    // Codeforces Gym contest ID
    codeforcesContestId: {
      type: Number,
      required: [true, "Codeforces contest ID is required"],
    },

    // Direct Codeforces Gym contest / invitation URL
    contestUrl: {
      type: String,
      required: [true, "Contest URL is required"],
      trim: true,
    },

    // Contest belongs to one batch
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Contest must be scoped to a batch"],
    },

    startTime: {
      type: Date,
      required: [true, "Contest start time is required"],
    },

    durationMinutes: {
      type: Number,
      required: [true, "Contest duration is required"],
    },

    problems: [
      {
        index: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          default: "",
        },

        points: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Admin who created the contest
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Running", "Finished", "Cancelled"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Contest", contestSchema);
