const Announcement = require("../models/Announcement");
const CalendarEvent = require("../models/CalendarEvent");
const Attendance = require("../models/Attendance");
const Progress = require("../models/Progress");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Assignment = require("../models/Assignment");
const asyncHandler = require("../utils/asyncHandler");
const {
  getVisibleAnnouncementsFilter,
} = require("../services/announcement.service");

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

const getMentorDashboard = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;

  const batches = await Batch.find({
    mentors: mentorId,
  });

  const students = await User.find({
    role: "student",
    mentor: mentorId,
    isActive: true,
  }).select("name email");

  const allStudentIds = students.map((student) => student._id);

  const attendanceRecords =
    allStudentIds.length > 0
      ? await Attendance.find({
          student: {
            $in: allStudentIds,
          },
        })
      : [];

  const studentStats = await Promise.all(
    students.map(async (student) => {
      const records = attendanceRecords.filter(
        (record) => String(record.student) === String(student._id),
      );

      const present = records.filter(
        (record) => record.status === "Present",
      ).length;

      const applicable = records.filter((record) =>
        ["Present", "Absent", "Late"].includes(record.status),
      ).length;

      const attendancePercentage =
        applicable > 0 ? Math.round((present / applicable) * 100) : 100;

      const progressRecords = await Progress.find({
        student: student._id,
      });

      const completedTopics = progressRecords.filter(
        (progress) => progress.status === "Completed",
      ).length;

      const totalTopics = progressRecords.length;

      const progressPercentage =
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      const riskReasons = [];

      if (attendancePercentage < 75) {
        riskReasons.push("Low attendance");
      }

      if (totalTopics > 0 && completedTopics === 0) {
        riskReasons.push("No completed topics");
      }

      const isAtRisk = riskReasons.length > 0;

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

  const atRiskStudents = studentStats.filter((student) => student.isAtRisk);

  const totalPresent = attendanceRecords.filter(
    (record) => record.status === "Present",
  ).length;

  const totalApplicable = attendanceRecords.filter((record) =>
    ["Present", "Absent", "Late"].includes(record.status),
  ).length;

  const overallAttendancePercentage =
    totalApplicable > 0
      ? Math.round((totalPresent / totalApplicable) * 100)
      : 0;

  const totalCompletedTopics = studentStats.reduce(
    (total, student) => total + student.completedTopics,
    0,
  );

  const assignments = await Assignment.find({
    createdBy: mentorId,
  }).select("_id title maxScore deadline");

  const assignmentIds = assignments.map((assignment) => assignment._id);

  const pendingGradingQueue =
    assignmentIds.length > 0
      ? await Submission.find({
          assignment: {
            $in: assignmentIds,
          },
          status: "Submitted",
        })
          .populate("student", "name email")
          .populate("assignment", "title maxScore deadline")
          .sort({
            submittedAt: -1,
          })
          .limit(10)
      : [];

  const pendingGradingCount =
    assignmentIds.length > 0
      ? await Submission.countDocuments({
          assignment: {
            $in: assignmentIds,
          },
          status: "Submitted",
        })
      : 0;

  res.status(200).json({
    success: true,
    data: {
      assignedStudentCount: students.length,
      studentStats,
      atRiskStudents,
      pendingGradingCount,
      pendingGradingQueue,
      assignedBatchCount: batches.length,
      overallAttendancePercentage,
      totalCompletedTopics,
    },
    message: "Mentor dashboard data fetched",
  });
});

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const attendanceRecords = await Attendance.find({
    student: studentId,
  });

  const present = attendanceRecords.filter(
    (record) => record.status === "Present",
  ).length;

  const applicable = attendanceRecords.filter((record) =>
    ["Present", "Absent", "Late"].includes(record.status),
  ).length;

  const attendancePercentage =
    applicable > 0 ? Math.round((present / applicable) * 100) : 0;

  const progressRecords = await Progress.find({
    student: studentId,
  });

  const completedTopics = progressRecords.filter(
    (progress) => progress.status === "Completed",
  ).length;

  const submissions = await Submission.find({
    student: studentId,
    status: "Graded",
  }).populate("assignment");

  const scores = submissions
    .filter((submission) => submission.assignment?.maxScore)
    .map(
      (submission) => (submission.score / submission.assignment.maxScore) * 100,
    );

  const averageGrade =
    scores.length > 0
      ? Math.round(
          scores.reduce((total, score) => total + score, 0) / scores.length,
        )
      : 0;

  const announcementFilter = await getVisibleAnnouncementsFilter(req.user);

  const recentAnnouncements = await Announcement.find(announcementFilter)
    .sort({
      publishDate: -1,
    })
    .limit(5);

  const upcomingAssignments = await Assignment.find({
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
      assignmentCount: submissions.length,
      recentAnnouncements,
      upcomingAssignments,
    },
    message: "Student dashboard data fetched",
  });
});

const getPublicDashboard = asyncHandler(async (req, res) => {
  const [activeBatchCount, totalAssignments, assignmentsCompleted] =
    await Promise.all([
      Batch.countDocuments({
        isActive: true,
      }),

      Assignment.countDocuments(),

      Submission.countDocuments({
        status: "Graded",
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

  res.status(200).json({
    success: true,
    data: {
      activeBatchCount,
      attendanceRate,
      assignmentsCompleted,
      totalAssignments,
    },
    message: "Public dashboard data fetched",
  });
});
const getPublicMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({
    role: "mentor",
    isActive: true,
  }).select("name");

  res.status(200).json({
    success: true,
    data: mentors,
    message: "Public mentors fetched",
  });
});

module.exports = {
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
  getPublicDashboard,
  getPublicMentors,
};
