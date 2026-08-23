const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["Link", "Document", "Video"], required: true },
    url: { type: String, required: true },
    topic: { type: String, required: true },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Populated only when the resource is an uploaded file (type "Document")
    // rather than an external link.
    fileName: { type: String, default: null },
    fileSize: { type: Number, default: null },
    mimeType: { type: String, default: null },
    cloudinaryPublicId: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resource", resourceSchema);
