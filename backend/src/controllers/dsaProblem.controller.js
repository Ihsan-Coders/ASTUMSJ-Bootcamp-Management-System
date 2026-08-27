const mongoose = require("mongoose");
const DSAProblemSubmission = require("../models/DSAProblemSubmission");
const asyncHandler = require("../utils/asyncHandler");

// ============================================================
// CREATE DSA PROBLEM
// ============================================================

const createDSAProblem = asyncHandler(async (req, res) => {
  const { problemLink, platform, timeTakenMinutes, solutionUrl } = req.body;

  /*
   * SECURITY:
   * Student identity ALWAYS comes from JWT.
   *
   * Never accept studentId from req.body.
   */
  const submission = await DSAProblemSubmission.create({
    student: req.user.id,
    problemLink,
    platform,
    timeTakenMinutes,
    solutionUrl,
  });

  const populatedSubmission = await DSAProblemSubmission.findById(
    submission._id,
  ).populate("student", "name email codeforcesHandle");

  return res.status(201).json({
    success: true,
    data: populatedSubmission,
    message: "DSA problem submitted successfully.",
  });
});

// ============================================================
// GET DSA PROBLEMS
// ============================================================

const getDSAProblems = asyncHandler(async (req, res) => {
  const { studentId, platform } = req.query;

  const filter = {};

  /*
   * Students can only see their own activity.
   */
  if (req.user.role === "student") {
    filter.student = req.user.id;
  }

  /*
   * Admin/mentor may filter by student.
   */
  if ((req.user.role === "admin" || req.user.role === "mentor") && studentId) {
    filter.student = studentId;
  }

  if (platform) {
    filter.platform = platform;
  }

  const submissions = await DSAProblemSubmission.find(filter)
    .populate("student", "name email codeforcesHandle")
    .sort({
      submittedAt: -1,
    });

  return res.status(200).json({
    success: true,
    data: submissions,
    message: "DSA problem activity fetched successfully.",
  });
});

// ============================================================
// GET MY DSA PROBLEMS
// ============================================================

const getMyDSAProblems = asyncHandler(async (req, res) => {
  const submissions = await DSAProblemSubmission.find({
    student: req.user.id,
  })
    .populate("student", "name email codeforcesHandle")
    .sort({
      submittedAt: -1,
    });

  return res.status(200).json({
    success: true,
    data: submissions,
    message: "Your DSA problem activity fetched successfully.",
  });
});

// ============================================================
// GET WEEKLY DSA ACTIVITY
// ============================================================

const getWeeklyDSAActivity = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  /*
   * Both dates are required.
   */
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "startDate and endDate are required.",
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  /*
   * Reject invalid dates.
   */
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid startDate or endDate.",
    });
  }

  /*
   * End date must be after start date.
   */
  if (end <= start) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "endDate must be after startDate.",
    });
  }

  /*
   * Students can only see their own weekly activity.
   *
   * Admin and mentor can see weekly activity for all students.
   */
  const match = {
    submittedAt: {
      $gte: start,
      $lt: end,
    },
  };

  if (req.user.role === "student") {
    match.student = new mongoose.Types.ObjectId(req.user.id);
  }

  const activity = await DSAProblemSubmission.aggregate([
    {
      $match: match,
    },

    // First remove duplicate submissions of the same problem
    {
      $group: {
        _id: {
          student: "$student",
          platform: "$platform",
          problemLink: "$problemLink",
        },
      },
    },

    // Then count unique problems for each student
    {
      $group: {
        _id: "$_id.student",
        problemCount: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        problemCount: -1,
      },
    },
  ]);

  /*
   * Populate student information after aggregation.
   */
  const studentIds = activity.map((item) => item._id);

  const students = await require("../models/User")
    .find({
      _id: { $in: studentIds },
    })
    .select("name email codeforcesHandle");

  const studentMap = new Map(
    students.map((student) => [student._id.toString(), student]),
  );

  const result = activity.map((item) => {
    const student = studentMap.get(item._id.toString());

    return {
      student: student
        ? {
            id: student._id,
            name: student.name,
            email: student.email,
            codeforcesHandle: student.codeforcesHandle || "",
          }
        : null,

      problemCount: item.problemCount,
    };
  });

  return res.status(200).json({
    success: true,

    data: {
      startDate,
      endDate,
      students: result,
    },

    message: "Weekly DSA activity fetched successfully.",
  });
});

module.exports = {
  createDSAProblem,
  getDSAProblems,
  getMyDSAProblems,
  getWeeklyDSAActivity,
};
