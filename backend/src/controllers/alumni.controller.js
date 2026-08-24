const AlumniProfile = require("../models/AlumniProfile");
const asyncHandler = require('../utils/asyncHandler');

const createAlumniProfile = asyncHandler(async (req, res) => {
    const profile = await AlumniProfile.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: profile,
        message: "Alumni profile created",
      });
})
const updateAlumniProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "student",
    "batch",
    "graduationDate",
    "currentRole",
    "testimonial",
    "isPublic",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const profile = await AlumniProfile.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("student", "name email")
    .populate("batch", "name");

  if (!profile) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Alumni profile not found",
    });
  }

  res.status(200).json({
    success: true,
    data: profile,
    message: "Alumni profile updated",
  });
});

const deleteAlumniProfile = asyncHandler(async (req, res) => {
  const profile = await AlumniProfile.findByIdAndDelete(req.params.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Alumni profile not found",
    });
  }

  res.status(200).json({
    success: true,
    data: null,
    message: "Alumni profile deleted",
  });
});
const getPublicAlumni = asyncHandler(async (req, res) => {
    const alumni = await AlumniProfile.find({ isPublic: true }).populate(
      "student",
      "name",
    );
    res
      .status(200)
      .json({ success: true, data: alumni, message: "Alumni fetched" });
})

module.exports = {
  createAlumniProfile,
  getPublicAlumni,
  updateAlumniProfile,
  deleteAlumniProfile,
};
