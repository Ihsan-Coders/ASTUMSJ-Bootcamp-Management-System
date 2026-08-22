const Announcement = require("../models/Announcement");
const CalendarEvent = require("../models/CalendarEvent");
const Attendance = require("../models/Attendance");
const Progress = require("../models/Progress");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Assignment = require("../models/Assignment");
const asyncHandler = require("../utils/asyncHandler");

/**
 * =========================
 * ADMIN DASHBOARD
 * =========================
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [studentCount, mentorCount, batchCount, pendingCount] =
    await Promise.all([
      User.countDocuments({
        role: "student",
        isActive: true,
      }),

      User.countDocuments({
        role: "mentor",
        isActive: true,
      }),

      Batch.countDocuments({
        isActive: true,
      }),

      User.countDocuments({
        role: "student",
        isActive: false,
      }),
    ]);

  const attendanceRecords = await Attendance.find();

  const presentCount = attendanceRecords.filter(
    (record) => record.status === "Present",
  ).length;

  const applicableCount = attendanceRecords.filter((record) =>
    ["Present", "Absent", "Late"].includes(record.status),
  ).length;

  const attendanceRate =
    applicableCount > 0
      ? Math.round((presentCount / applicableCount) * 100)
      : 0;

  const totalAssignments = await Assignment.countDocuments();
  const totalSubmissions = await Submission.countDocuments();

  const gradedSubmissions = await Submission.countDocuments({
    status: "Graded",
  });

  const recentActivity = await Submission.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("student", "name")
    .populate("assignment", "title");

  res.status(200).json({
    success: true,
    data: {
      studentCount,
      mentorCount,
      batchCount,
      pendingCount,
      attendanceRate,
      totalAssignments,
      totalSubmissions,
      gradedSubmissions,
      recentActivity,
    },
    message: "Admin dashboard data fetched",
  });
});

/**
 * =========================
 * MENTOR DASHBOARD
 * =========================
 */
const getMentorDashboard = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;

  /**
   * Get batches assigned to this mentor
   */
  const batches = await Batch.find({
    mentors: mentorId,
  }).populate("students", "name email");

  /**
   * Collect unique students from all mentor batches
   */
  const studentsMap = new Map();

  batches.forEach((batch) => {
    batch.students.forEach((student) => {
      studentsMap.set(String(student._id), student);
    });
  });

  const students = Array.from(studentsMap.values());

  const allStudentIds = students.map(
    (student) => student._id,
  );

  /**
   * =========================
   * ATTENDANCE
   * =========================
   */
  const attendanceRecords =
    allStudentIds.length > 0
      ? await Attendance.find({
          student: {
            $in: allStudentIds,
          },
        })
      : [];

  /**
   * =========================
   * STUDENT STATS
   * =========================
   */
  const studentStats = await Promise.all(
    students.map(async (student) => {
      const records = attendanceRecords.filter(
        (record) =>
          String(record.student) ===
          String(student._id),
      );

      const present = records.filter(
        (record) => record.status === "Present",
      ).length;

      const applicable = records.filter((record) =>
        ["Present", "Absent", "Late"].includes(
          record.status,
        ),
      ).length;

      const attendancePercentage =
        applicable > 0
          ? Math.round(
              (present / applicable) * 100,
            )
          : 100;

      /**
       * Get student's progress records
       */
      const progressRecords = await Progress.find({
        student: student._id,
      });

      const completedTopics =
        progressRecords.filter(
          (progress) =>
            progress.status === "Completed",
        ).length;

      const totalTopics = progressRecords.length;

      const progressPercentage =
        totalTopics > 0
          ? Math.round(
              (completedTopics / totalTopics) *
                100,
            )
          : 0;

      /**
       * Determine whether student is at risk
       */
      const riskReasons = [];

      if (attendancePercentage < 75) {
        riskReasons.push("Low attendance");
      }

      if (
        totalTopics > 0 &&
        completedTopics === 0
      ) {
        riskReasons.push(
          "No completed topics",
        );
      }

      const isAtRisk =
        riskReasons.length > 0;

      return {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
        },

        attendancePercentage,

        completedTopics,

        totalTopics,

        progressPercentage,

        isAtRisk,

        riskReasons,
      };
    }),
  );

  /**
   * Students who are at risk
   */
  const atRiskStudents =
    studentStats.filter(
      (student) => student.isAtRisk,
    );

  /**
   * =========================
   * OVERALL ATTENDANCE
   * =========================
   */
  const totalPresent =
    attendanceRecords.filter(
      (record) =>
        record.status === "Present",
    ).length;

  const totalApplicable =
    attendanceRecords.filter((record) =>
      ["Present", "Absent", "Late"].includes(
        record.status,
      ),
    ).length;

  const overallAttendancePercentage =
    totalApplicable > 0
      ? Math.round(
          (totalPresent /
            totalApplicable) *
            100,
        )
      : 0;

  /**
   * =========================
   * TOTAL COMPLETED TOPICS
   * =========================
   */
  const totalCompletedTopics =
    studentStats.reduce(
      (total, student) =>
        total +
        student.completedTopics,
      0,
    );

  /**
   * =========================
   * MENTOR ASSIGNMENTS
   * =========================
   */
  const assignments =
    await Assignment.find({
      createdBy: mentorId,
    }).select("_id title maxScore deadline");

  const assignmentIds =
    assignments.map(
      (assignment) => assignment._id,
    );

  /**
   * =========================
   * PENDING GRADING
   * =========================
   *
   * Only submissions belonging to
   * assignments created by this mentor
   * and still having "Submitted" status
   * are included.
   */
  const pendingGradingQueue =
    assignmentIds.length > 0
      ? await Submission.find({
          assignment: {
            $in: assignmentIds,
          },

          status: "Submitted",
        })
          .populate(
            "student",
            "name email",
          )
          .populate(
            "assignment",
            "title maxScore deadline",
          )
          .sort({
            submittedAt: -1,
          })
          .limit(10)
      : [];

  /**
   * Number of pending submissions
   */
  const pendingGradingCount =
    assignmentIds.length > 0
      ? await Submission.countDocuments({
          assignment: {
            $in: assignmentIds,
          },

          status: "Submitted",
        })
      : 0;

  /**
   * =========================
   * RESPONSE
   * =========================
   */
  res.status(200).json({
    success: true,

    data: {
      assignedStudentCount:
        students.length,

      studentStats,

      atRiskStudents,

      pendingGradingCount,

      pendingGradingQueue,

      assignedBatchCount:
        batches.length,

      overallAttendancePercentage,

      totalCompletedTopics,
    },

    message:
      "Mentor dashboard data fetched",
  });
});

/**
 * =========================
 * STUDENT DASHBOARD
 * =========================
 */
const getStudentDashboard = asyncHandler(
  async (req, res) => {
    const studentId = req.user.id;

    /**
     * Attendance
     */
    const attendanceRecords =
      await Attendance.find({
        student: studentId,
      });

    const present =
      attendanceRecords.filter(
        (record) =>
          record.status === "Present",
      ).length;

    const applicable =
      attendanceRecords.filter((record) =>
        ["Present", "Absent", "Late"].includes(
          record.status,
        ),
      ).length;

    const attendancePercentage =
      applicable > 0
        ? Math.round(
            (present / applicable) * 100,
          )
        : 0;

    /**
     * Progress
     */
    const progressRecords =
      await Progress.find({
        student: studentId,
      });

    const completedTopics =
      progressRecords.filter(
        (progress) =>
          progress.status === "Completed",
      ).length;

    /**
     * Graded submissions
     */
    const submissions =
      await Submission.find({
        student: studentId,
        status: "Graded",
      }).populate("assignment");

    const scores = submissions
      .filter(
        (submission) =>
          submission.assignment?.maxScore,
      )
      .map(
        (submission) =>
          (submission.score /
            submission.assignment
              .maxScore) *
          100,
      );

    const averageGrade =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (total, score) =>
                total + score,
              0,
            ) / scores.length,
          )
        : 0;

    /**
     * Recent announcements
     */
    const recentAnnouncements =
      await Announcement.find()
        .sort({
          publishDate: -1,
        })
        .limit(5);

    /**
     * Upcoming assignments
     */
    const upcomingAssignments =
      await Assignment.find({
        deadline: {
          $gte: new Date(),
        },
      })
        .sort({
          deadline: 1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      data: {
        attendancePercentage,

        completedTopics,

        averageGrade,

        assignmentCount:
          submissions.length,

        recentAnnouncements,

        upcomingAssignments,
      },

      message:
        "Student dashboard data fetched",
    });
  },
);

module.exports = {
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
};