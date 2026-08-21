const Progress = require('../models/Progress');
const asyncHandler = require('../utils/asyncHandler');

// Update or create student progress
const updateProgress = asyncHandler(async (req, res) => {
    const { student, batch, topic, status, notes } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { student, topic },
      {
        batch,
        status,
        notes,
        updatedBy: req.user.id
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Progress updated'
    });
})


// Get student progress with optional filters
const getProgress = asyncHandler(async (req, res) => {
    const { studentId, batchId } = req.query;

    const filter = {};

    if (studentId) filter.student = studentId;
    if (batchId) filter.batch = batchId;

    const records = await Progress.find(filter);

    res.status(200).json({
      success: true,
      data: records,
      message: 'Progress fetched'
    });
})


// Calculate a student's progress summary and percentage
const getProgressSummary = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const records = await Progress.find({
      student: studentId
    });

    const totalTopics = records.length;

    const completed = records.filter(
      record => record.status === 'Completed'
    ).length;

    const inProgress = records.filter(
      record => record.status === 'In Progress'
    ).length;

    const needsImprovement = records.filter(
      record => record.status === 'Needs Improvement'
    ).length;

    const notStarted = records.filter(
      record => record.status === 'Not Started'
    ).length;

    const progressPercentage =
      totalTopics === 0
        ? 0
        : Math.round((completed / totalTopics) * 100);

    res.status(200).json({
      success: true,
      data: {
        studentId,
        totalTopics,
        completed,
        inProgress,
        needsImprovement,
        notStarted,
        progressPercentage
      },
      message: 'Progress summary fetched'
    });
})


module.exports = {
  updateProgress,
  getProgress,
  getProgressSummary
};
