const Progress = require("../models/Progress");

const updateProgress = async (req, res) => {
  try {
    const { student, batch, topic, status, notes } = req.body;

    // Upsert: one Progress record per student+topic, update if exists, create if not
    const progress = await Progress.findOneAndUpdate(
      { student, topic },
      { batch, status, notes, updatedBy: req.user.id },
      { new: true, upsert: true },
    );

    res
      .status(200)
      .json({ success: true, data: progress, message: "Progress updated" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const { studentId, batchId } = req.query;
    const filter = {};
    if (studentId) filter.student = studentId;
    if (batchId) filter.batch = batchId;

    const records = await Progress.find(filter);
    res
      .status(200)
      .json({ success: true, data: records, message: "Progress fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { updateProgress, getProgress };
