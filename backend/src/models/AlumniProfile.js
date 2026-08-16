const mongoose = require("mongoose");

const alumniProfileSchema = new mongoose.Schema(
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
    graduationDate: { type: Date, required: true },
    currentRole: { type: String, default: "" },
    testimonial: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AlumniProfile", alumniProfileSchema);
