const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
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
    topic: { type: String, required: true },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "Needs Improvement"],
      default: "Not Started",
    },
    notes: { type: String, default: "" },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Progress", progressSchema);
