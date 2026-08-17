const Progress = require('../models/Progress');

// Update or create student progress
const updateProgress = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message
    });
  }
};


// Get student progress with optional filters
const getProgress = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message
    });
  }
};


// Calculate a student's progress summary and percentage
const getProgressSummary = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message
    });
  }
};


module.exports = {
  updateProgress,
  getProgress,
  getProgressSummary
};