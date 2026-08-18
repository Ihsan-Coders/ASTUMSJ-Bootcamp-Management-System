const mongoose = require("mongoose");
const badgeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "PerfectAttendance",
        "TopScorer",
        "FastSubmitter",
        "ConsistentPerformer",
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now },
    relatedData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

// Prevent awarding the exact same badge type twice to the same student
badgeSchema.index({ student: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Badge", badgeSchema);
