const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Contest name is required"],
      trim: true,
    },
    codeforcesContestId: {
      type: Number,
      required: [true, "Codeforces contest ID is required"],
    },
    contestUrl: {
      type: String,
      trim: true,
    },
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
        index: { type: String, required: true },
        name: { type: String, default: "" },
        points: { type: Number, default: 0 },
      },
    ],
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
  { timestamps: true },
);

contestSchema.pre("save", function () {
  if (!this.contestUrl && this.codeforcesContestId) {
    this.contestUrl = `https://codeforces.com/contest/${this.codeforcesContestId}`;
  }
});

module.exports = mongoose.model("Contest", contestSchema);
