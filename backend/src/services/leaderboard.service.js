const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const calculateLeaderboard = async (batchId = null) => {
  const userFilter = { role: 'student', isActive: true };
  if (batchId) userFilter.batch = batchId;
  const students = await User.find(userFilter).select('name');

  const leaderboard = await Promise.all(
    students.map(async (student) => {
      // Average score across graded submissions
      const submissions = await Submission.find({ student: student._id, status: 'Graded' }).populate('assignment');
      const scores = submissions
        .filter((s) => s.assignment?.maxScore)
        .map((s) => (s.score / s.assignment.maxScore) * 100);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      // Attendance %
      const attendance = await Attendance.find({ student: student._id });
      const present = attendance.filter((a) => a.status === 'Present').length;
      const applicable = attendance.filter((a) => ['Present', 'Absent', 'Late'].includes(a.status)).length;
      const attendancePct = applicable > 0 ? (present / applicable) * 100 : 0;

      // Combined score: 70% academic, 30% attendance — weighting is a design choice, adjust as team prefers
      const combinedScore = Math.round(avgScore * 0.7 + attendancePct * 0.3);

      return {
        student: { id: student._id, name: student.name },
        avgScore: Math.round(avgScore),
        attendancePct: Math.round(attendancePct),
        combinedScore,
      };
    })
  );

  return leaderboard.sort((a, b) => b.combinedScore - a.combinedScore);
};

module.exports = { calculateLeaderboard };
