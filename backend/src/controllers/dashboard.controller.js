const Announcement = require("../models/Announcement");
const CalendarEvent = require("../models/CalendarEvent");
const Attendance = require("../models/Attendance");
const Progress = require("../models/Progress");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Progress = require("../models/Progress");
const getAdminDashboard = async (req, res) => {
  try {
    const [studentCount, mentorCount, batchCount, pendingCount] =
      await Promise.all([
        User.countDocuments({ role: "student", isActive: true }),
        User.countDocuments({ role: "mentor", isActive: true }),
        Batch.countDocuments({ isActive: true }),
        User.countDocuments({ role: "student", isActive: false }),
      ]);

    // Overall attendance rate across the platform
    const attendanceRecords = await Attendance.find();
    const presentCount = attendanceRecords.filter(
      (r) => r.status === "Present",
    ).length;
    const applicableCount = attendanceRecords.filter((r) =>
      ["Present", "Absent", "Late"].includes(r.status),
    ).length;
    const attendanceRate =
      applicableCount > 0
        ? Math.round((presentCount / applicableCount) * 100)
        : 0;

    // Assignment stats
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const gradedSubmissions = await Submission.countDocuments({
      status: "Graded",
    });

    // Recent activity — last 10 submissions across the platform
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
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};
const getMentorDashboard = async (req, res) => {
  try {
    const mentorId = req.user.id;

    // ==========================================
    // 1. Find batches assigned to this mentor
    // ==========================================
    const batches = await Batch.find({
      mentors: mentorId,
    }).populate("students", "name email");

    // ==========================================
    // 2. Get all students from assigned batches
    // ==========================================
    const studentsMap = new Map();

    batches.forEach((batch) => {
      batch.students.forEach((student) => {
        studentsMap.set(String(student._id), student);
      });
    });

    const students = Array.from(studentsMap.values());

    const allStudentIds = students.map((student) => student._id);

    // ==========================================
    // 3. Get attendance records
    // ==========================================
    const attendanceRecords = await Attendance.find({
      student: { $in: allStudentIds },
    });

    // ==========================================
    // 4. Create student statistics
    // ==========================================
    const studentStats = await Promise.all(
      students.map(async (student) => {
        const records = attendanceRecords.filter(
          (record) => String(record.student) === String(student._id),
        );

        // Attendance
        const present = records.filter(
          (record) => record.status === "Present",
        ).length;

        const applicable = records.filter((record) =>
          ["Present", "Absent", "Late"].includes(record.status),
        ).length;

        const attendancePercentage =
          applicable > 0 ? Math.round((present / applicable) * 100) : 100;

        // Progress
        const progressRecords = await Progress.find({
          student: student._id,
        });

        const completedTopics = progressRecords.filter(
          (progress) => progress.status === "Completed",
        ).length;

        // ==========================================
        // 5. Determine risk reasons
        // ==========================================
        const riskReasons = [];

        if (attendancePercentage < 75) {
          riskReasons.push("Low attendance");
        }

        if (completedTopics === 0) {
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

          isAtRisk,

          riskReasons,
        };
      }),
    );

    // ==========================================
    // 6. Find at-risk students
    // ==========================================
    const atRiskStudents = studentStats.filter((student) => student.isAtRisk);

    // ==========================================
    // 7. Overall attendance
    // ==========================================
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

    // ==========================================
    // 8. Total completed topics
    // ==========================================
    const totalCompletedTopics = studentStats.reduce(
      (total, student) => total + student.completedTopics,
      0,
    );

    // ==========================================
    // 9. Find mentor's assignments
    // ==========================================
    const assignments = await Assignment.find({
      createdBy: mentorId,
    });

    // ==========================================
    // 10. Count pending submissions
    // ==========================================
    const pendingSubmissions = await Submission.countDocuments({
      assignment: {
        $in: assignments.map((assignment) => assignment._id),
      },
      status: "Submitted",
    });

    // ==========================================
    // 11. Send dashboard response
    // ==========================================
    res.status(200).json({
      success: true,

      data: {
        // Original M2 fields
        assignedStudentCount: students.length,
        studentStats,
        atRiskStudents,
        pendingGradingCount: pendingSubmissions,

        // Additional useful information
        assignedBatchCount: batches.length,
        overallAttendancePercentage,
        totalCompletedTopics,
      },

      message: "Mentor dashboard data fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Get all information needed for the student's dashboard.
const getStudentDashboard = async (req, res) => {
  try {
    // Get the ID of the currently logged-in student.
    // auth.middleware should put the logged-in user inside req.user.
    const studentId = req.user.id;

    // Find all attendance records belonging to this student.
    const attendanceRecords = await Attendance.find({
      student: studentId,
    });

    // Count how many attendance records have Present status.
    const present = attendanceRecords.filter(
      (r) => r.status === "Present",
    ).length;

    // Count only attendance records that can be used
    // to calculate the attendance percentage.
    const applicable = attendanceRecords.filter((r) =>
      ["Present", "Absent", "Late"].includes(r.status),
    ).length;

    // Calculate attendance percentage.
    // If there are no applicable records, return 0
    // instead of dividing by zero.
    const attendancePercentage =
      applicable > 0 ? Math.round((present / applicable) * 100) : 0;

    // Find all progress records belonging to this student.
    const progressRecords = await Progress.find({
      student: studentId,
    });

    // Count how many topics the student completed.
    const completedTopics = progressRecords.filter(
      (p) => p.status === "Completed",
    ).length;

    // Find this student's graded submissions.
    //
    // populate('assignment') gives us information
    // about the assignment, including maxScore.
    const submissions = await Submission.find({
      student: studentId,
      status: "Graded",
    }).populate("assignment");

    // Convert every grade into a percentage.
    const scores = submissions
      .filter((s) => s.assignment?.maxScore)
      .map((s) => (s.score / s.assignment.maxScore) * 100);

    // Calculate the student's average grade.
    //
    // If there are no scores, return 0.
    const averageGrade =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    // Get the five most recently published announcements.
    const recentAnnouncements = await Announcement.find()
      .sort({ publishDate: -1 })
      .limit(5);

    // Get the five upcoming assignment deadlines.
    //
    // $gte means "greater than or equal to".
    // Therefore, events before the current date are excluded.
    const upcomingDeadlines = await CalendarEvent.find({
      type: "AssignmentDeadline",
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5);

    // Send all dashboard information back to the frontend.
    res.status(200).json({
      success: true,

      data: {
        attendancePercentage,
        completedTopics,
        averageGrade,
        assignmentCount: submissions.length,
        recentAnnouncements,
        upcomingDeadlines,
      },

      message: "Student dashboard data fetched",
    });
  } catch (err) {
    // If something goes wrong, return a server error.
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
};
