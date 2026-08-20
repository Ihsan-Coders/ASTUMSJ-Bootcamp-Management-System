const Badge = require("../models/Badge");
const asyncHandler = require('../utils/asyncHandler');


const getStudentBadges = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId || req.user.id;
    const badges = await Badge.find({ student: studentId }).sort({
      awardedAt: -1,
    });
    res
      .status(200)
      .json({ success: true, data: badges, message: "Badges fetched" });
})
module.exports = { getStudentBadges };
