const User = require('../models/User');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Progress = require('../models/Progress');
const getAdminDashboard = async (req, res) => {
  try {
    const [studentCount, mentorCount, batchCount, pendingCount] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'mentor', isActive: true }),
      Batch.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: false }),
    ]);

    // Overall attendance rate across the platform
    const attendanceRecords = await Attendance.find();
    const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;
    const applicableCount = attendanceRecords.filter((r) => ['Present', 'Absent', 'Late'].includes(r.status)).length;
    const attendanceRate = applicableCount > 0 ? Math.round((presentCount / applicableCount) * 100) : 0;

    // Assignment stats
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const gradedSubmissions = await Submission.countDocuments({ status: 'Graded' });

    // Recent activity — last 10 submissions across the platform
    const recentActivity = await Submission.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('student', 'name')
      .populate('assignment', 'title');

    res.status(200).json({
      success: true,
      data: {
        studentCount, mentorCount, batchCount, pendingCount,
        attendanceRate, totalAssignments, totalSubmissions, gradedSubmissions,
        recentActivity,
      },
      message: 'Admin dashboard data fetched',
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
    }).populate('students', 'name email');

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
          (record) =>
            String(record.student) === String(student._id)
        );

        // Attendance
        const present = records.filter(
          (record) => record.status === 'Present'
        ).length;

        const applicable = records.filter(
          (record) =>
            ['Present', 'Absent', 'Late'].includes(record.status)
        ).length;

        const attendancePercentage =
          applicable > 0
            ? Math.round((present / applicable) * 100)
            : 100;

        // Progress
        const progressRecords = await Progress.find({
          student: student._id,
        });

        const completedTopics = progressRecords.filter(
          (progress) => progress.status === 'Completed'
        ).length;

        // ==========================================
        // 5. Determine risk reasons
        // ==========================================
        const riskReasons = [];

        if (attendancePercentage < 75) {
          riskReasons.push('Low attendance');
        }

        if (completedTopics === 0) {
          riskReasons.push('No completed topics');
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
      })
    );

    // ==========================================
    // 6. Find at-risk students
    // ==========================================
    const atRiskStudents = studentStats.filter(
      (student) => student.isAtRisk
    );

    // ==========================================
    // 7. Overall attendance
    // ==========================================
    const totalPresent = attendanceRecords.filter(
      (record) => record.status === 'Present'
    ).length;

    const totalApplicable = attendanceRecords.filter(
      (record) =>
        ['Present', 'Absent', 'Late'].includes(record.status)
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
      0
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
      status: 'Submitted',
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

      message: 'Mentor dashboard data fetched',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

module.exports = { getAdminDashboard,getMentorDashboard };
