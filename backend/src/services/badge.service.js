const Badge = require("../models/Badge");

const awardBadgeIfNotExists = async (
  studentId,
  type,
  title,
  description,
  relatedData = {},
) => {
  try {
    const existing = await Badge.findOne({ student: studentId, type });
    if (existing) return null; // already has this badge
    return await Badge.create({
      student: studentId,
      type,
      title,
      description,
      relatedData,
    });
  } catch (err) {
    // duplicate key error is expected/harmless due to the unique index — ignore it
    if (err.code !== 11000) console.error("Badge award error:", err.message);
    return null;
  }
};

// Rule 1: Perfect Attendance — 100% present over the last 14 days
// NOTE: this needs Attendance.js to exist and be populated with real data —
// blocked until M2 ships it. Code is ready, just not testable yet.
const checkPerfectAttendance = async (studentId) => {
  const Attendance = require("../models/Attendance");
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const records = await Attendance.find({
    student: studentId,
    date: { $gte: twoWeeksAgo },
  });
  if (records.length === 0) return;

  const allPresent = records.every((r) => r.status === "Present");
  if (allPresent) {
    await awardBadgeIfNotExists(
      studentId,
      "PerfectAttendance",
      "Perfect Attendance",
      "100% attendance over the last 2 weeks",
      { checkedAt: new Date() },
    );
  }
};

// Rule 2: Top Scorer — scored 90%+ on any graded assignment
// Expects `submission.assignment` to be a populated object with maxScore
const checkTopScorer = async (studentId, submission) => {
  if (!submission.score || !submission.assignment?.maxScore) return;
  const percentage = (submission.score / submission.assignment.maxScore) * 100;
  if (percentage >= 90) {
    await awardBadgeIfNotExists(
      studentId,
      "TopScorer",
      "Top Scorer",
      `Scored ${percentage.toFixed(0)}% on an assignment`,
      { submissionId: submission._id },
    );
  }
};

// Rule 3: Fast Submitter — submitted more than 24 hours before deadline
// Expects `submission.assignment` to be a populated object with deadline
const checkFastSubmitter = async (studentId, submission) => {
  if (!submission.assignment?.deadline) return;
  const deadline = new Date(submission.assignment.deadline);
  const submittedAt = new Date(submission.submittedAt || submission.createdAt);
  const hoursEarly = (deadline - submittedAt) / (1000 * 60 * 60);

  if (hoursEarly >= 24) {
    await awardBadgeIfNotExists(
      studentId,
      "FastSubmitter",
      "Fast Submitter",
      "Submitted an assignment more than 24 hours before the deadline",
      { submissionId: submission._id },
    );
  }
};

module.exports = { checkPerfectAttendance, checkTopScorer, checkFastSubmitter };
