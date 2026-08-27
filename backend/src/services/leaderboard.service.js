const Submission = require("../models/Submission");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const DSAProblemSubmission = require("../models/DSAProblemSubmission");
const ContestResult = require("../models/ContestResult");
const Batch = require("../models/Batch");
const { calculateAttendancePercentage } = require("./attendance.service");
const calculateLeaderboard = async (reqUser = {}, batchId = null) => {
  /*
   * ============================================================
   * 1. DETERMINE WHICH STUDENTS THE USER MAY SEE
   * ============================================================
   */

  const userFilter = {
    role: "student",
    isActive: true,
  };

  // Student -> only students from their own batch
  if (reqUser.role === "student") {
    if (!reqUser.batch) {
      return [];
    }

    userFilter.batch = reqUser.batch;
  }

  // Mentor -> only students belonging to mentor's batches
  if (reqUser.role === "mentor") {
    const batches = await Batch.find({
      mentors: reqUser.id,
    }).select("_id");

    const batchIds = batches.map((batch) => batch._id);

    if (batchId) {
      const allowed = batchIds.some((id) => String(id) === String(batchId));

      if (!allowed) {
        return [];
      }

      userFilter.batch = batchId;
    } else {
      userFilter.batch = {
        $in: batchIds,
      };
    }
  }

  // Admin -> can see all students or filter by batch
  if (reqUser.role === "admin" && batchId) {
    userFilter.batch = batchId;
  }

  /*
   * ============================================================
   * 2. GET STUDENTS
   * ============================================================
   */

  const students = await User.find(userFilter).select(
    "name email codeforcesHandle batch",
  );

  /*
   * ============================================================
   * 3. BUILD PERFORMANCE DATA
   * ============================================================
   */

  const leaderboard = await Promise.all(
    students.map(async (student) => {
      /*
       * --------------------------------------------------------
       * ASSIGNMENTS
       * --------------------------------------------------------
       *
       * Use the existing Assignment/Submission system.
       *
       * IMPORTANT:
       * maxScore can be 5, 10, 20, 30, 100, etc.
       *
       * Therefore every graded submission is normalized:
       *
       * score / maxScore * 100
       */

      const submissions = await Submission.find({
        student: student._id,
        status: "Graded",
      }).populate("assignment", "maxScore");

      const normalizedScores = submissions
        .filter(
          (submission) =>
            submission.assignment &&
            submission.assignment.maxScore != null &&
            submission.assignment.maxScore > 0 &&
            submission.score != null,
        )
        .map(
          (submission) =>
            (submission.score / submission.assignment.maxScore) * 100,
        );

      const averageAssignmentScore =
        normalizedScores.length > 0
          ? Math.round(
              normalizedScores.reduce((sum, score) => sum + score, 0) /
                normalizedScores.length,
            )
          : 0;

      /*
       * --------------------------------------------------------
       * ATTENDANCE
       * --------------------------------------------------------
       *
       * Use the attendance records already maintained by the
       * attendance system.
       *
       * We are NOT creating a second attendance model/formula.
       */

      const attendanceRecords = await Attendance.find({
        student: student._id,
      });

      const present = attendanceRecords.filter(
        (record) => record.status === "Present",
      ).length;

      const applicable = attendanceRecords.filter((record) =>
        ["Present", "Absent", "Late"].includes(record.status),
      ).length;

      // Use the official attendance calculation service.
      const attendancePercentage =
        calculateAttendancePercentage(attendanceRecords);

      /*
       * --------------------------------------------------------
       * DSA
       * --------------------------------------------------------
       *
       * Count unique problems.
       *
       * A duplicate submission for the same platform/problem
       * must NOT increase the solved-problem count.
       */

      const dsaSubmissions = await DSAProblemSubmission.find({
        student: student._id,
      }).select("problemLink platform submittedAt");

      const uniqueProblems = new Set();

      dsaSubmissions.forEach((submission) => {
        const platform = (submission.platform || "unknown")
          .trim()
          .toLowerCase();
        const problemLink = (submission.problemLink || "").trim();

        if (problemLink) {
          uniqueProblems.add(`${platform}:${problemLink}`);
        }
      });

      /*
       * --------------------------------------------------------
       * CP
       * --------------------------------------------------------
       *
       * Read actual ContestResult records.
       *
       * Students cannot manually modify these values because
       * ContestResult is populated by the CP fetching system.
       *
       * Only "Fetched" results count as actual participation.
       */

      const contestResults = await ContestResult.find({
        student: student._id,
        status: "Fetched",
      }).select(
        "contest rank points problemsSolved solvedProblemIndexes status",
      );

      const contestPoints = contestResults.reduce(
        (sum, result) => sum + (result.points || 0),
        0,
      );

      const contestProblemsSolved = contestResults.reduce(
        (sum, result) => sum + (result.problemsSolved || 0),
        0,
      );

      /*
       * --------------------------------------------------------
       * RETURN PERFORMANCE DATA
       * --------------------------------------------------------
       *
       * No overall score is calculated here.
       *
       * The SRS does not define a weighting formula, so we do
       * NOT invent one.
       */

      return {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          codeforcesHandle: student.codeforcesHandle || "",
          batch: student.batch,
        },

        attendance: {
          present,
          applicable,
          percentage: attendancePercentage,
        },

        dsa: {
          uniqueProblemsSolved: uniqueProblems.size,
          totalSubmissions: dsaSubmissions.length,
        },

        contests: {
          participated: contestResults.length,
          totalPoints: contestPoints,
          problemsSolved: contestProblemsSolved,
        },

        assignment: {
          gradedSubmissions: normalizedScores.length,
          averageScore: averageAssignmentScore,
        },
      };
    }),
  );

  /*
   * ============================================================
   * 4. DO NOT INVENT OVERALL SCORING
   * ============================================================
   *
   * Since the SRS does not define weights, we return the raw
   * aggregated metrics.
   *
   * The frontend can display the data without pretending that
   * one student is "better" based on an invented formula.
   */

  return leaderboard;
};

module.exports = {
  calculateLeaderboard,
};
