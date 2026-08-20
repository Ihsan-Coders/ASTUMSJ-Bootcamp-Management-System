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

const getPublicAlumni = asyncHandler(async (req, res) => {
    const alumni = await AlumniProfile.find({ isPublic: true }).populate(
      "student",
      "name",
    );
    res
      .status(200)
      .json({ success: true, data: alumni, message: "Alumni fetched" });
})

module.exports = { createAlumniProfile, getPublicAlumni };
