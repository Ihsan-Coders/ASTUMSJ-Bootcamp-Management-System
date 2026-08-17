const mongoose = require("mongoose");
const mentorNoteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    note: { type: String, required: true },
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("MentorNote", mentorNoteSchema);
