const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");

// ======================================================
// UPDATE / CREATE STUDENT PROGRESS
// Mentor only
// ======================================================

const updateProgress = asyncHandler(async (req, res) => {
  const {
    student,
    batch,
    topic,
    progress,
    status,
    notes = "",
  } = req.body;

  if (
    !student ||
    !batch ||
    !topic ||
    progress === undefined ||
    !status
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Student, batch, topic, progress and status are required.",
    });
  }

  const progressValue = Number(progress);

  if (
    Number.isNaN(progressValue) ||
    progressValue < 0 ||
    progressValue > 100
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Progress must be a number between 0 and 100.",
    });
  }

  const progressRecord = await Progress.findOneAndUpdate(
    {
      student,
      batch,
      topic: topic.trim(),
    },
    {
      student,
      batch,
      topic: topic.trim(),
      progress: progressValue,
      status,
      notes: notes.trim(),
      updatedBy: req.user.id,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    success: true,
    data: progressRecord,
    message: "Progress updated successfully.",
  });
});

// ======================================================
// GET STUDENT PROGRESS
// Admin / Mentor / Student
// ======================================================

const getProgress = asyncHandler(async (req, res) => {
  const { studentId, batchId } = req.query;

  const filter = {};

  // Students can only see their own progress.
  if (req.user.role === "student") {
    filter.student = req.user.id;
  } else if (studentId) {
    filter.student = studentId;
  }

  if (batchId) {
    filter.batch = batchId;
  }

  const records = await Progress.find(filter)
    .populate("student", "name email")
    .populate("batch", "name")
    .populate("updatedBy", "name email")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: records,
    message: "Progress fetched successfully.",
  });
});

// ======================================================
// GET STUDENT PROGRESS SUMMARY
// ======================================================

const getProgressSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (
    req.user.role === "student" &&
    String(req.user.id) !== String(studentId)
  ) {
    return res.status(403).json({
      success: false,
      data: null,
      message:
        "You are not allowed to view another student's progress.",
    });
  }

  const records = await Progress.find({
    student: studentId,
  });

  const totalTopics = records.length;

  const completed = records.filter(
    (record) => record.status === "Completed"
  ).length;

  const inProgress = records.filter(
    (record) => record.status === "In Progress"
  ).length;

  const needsImprovement = records.filter(
    (record) => record.status === "Needs Improvement"
  ).length;

  const notStarted = records.filter(
    (record) => record.status === "Not Started"
  ).length;

  const progressPercentage =
    totalTopics === 0
      ? 0
      : Math.round(
          records.reduce(
            (total, record) =>
              total + Number(record.progress || 0),
            0
          ) / totalTopics
        );

  res.status(200).json({
    success: true,
    data: {
      studentId,
      totalTopics,
      completed,
      inProgress,
      needsImprovement,
      notStarted,
      progressPercentage,
    },
    message: "Progress summary fetched successfully.",
  });
});

module.exports = {
  updateProgress,
  getProgress,
  getProgressSummary,
};