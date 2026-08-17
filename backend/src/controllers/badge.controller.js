const Badge = require("../models/Badge");
const getStudentBadges = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const badges = await Badge.find({ student: studentId }).sort({
      awardedAt: -1,
    });
    res
      .status(200)
      .json({ success: true, data: badges, message: "Badges fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};
module.exports = { getStudentBadges };
