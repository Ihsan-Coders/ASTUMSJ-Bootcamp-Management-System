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

    isActive: {
      type: Boolean,
      default: true,
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
