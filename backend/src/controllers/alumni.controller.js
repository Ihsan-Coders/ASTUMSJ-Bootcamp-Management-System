const AlumniProfile = require("../models/AlumniProfile");
const createAlumniProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: profile,
        message: "Alumni profile created",
      });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};
const getPublicAlumni = async (req, res) => {
  try {
    const alumni = await AlumniProfile.find({ isPublic: true }).populate(
      "student",
      "name",
    );
    res
      .status(200)
      .json({ success: true, data: alumni, message: "Alumni fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};
module.exports = { createAlumniProfile, getPublicAlumni };
