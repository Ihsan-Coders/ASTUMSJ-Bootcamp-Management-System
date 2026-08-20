const User = require('../models/User');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const asyncHandler = require('../utils/asyncHandler');
const Progress = require('../models/Progress');
const getAdminDashboard = asyncHandler(async (req, res) => {
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

module.exports = { getAdminDashboard };
