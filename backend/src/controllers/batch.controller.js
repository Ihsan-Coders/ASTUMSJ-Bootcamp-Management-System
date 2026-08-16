const Batch = require('../models/Batch');

const createBatch = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const batch = await Batch.create({ name, startDate, endDate });
    res.status(201).json({ success: true, data: batch, message: 'Batch created' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('mentors students', 'name email role');
    res.status(200).json({ success: true, data: batches, message: 'Batches fetched' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!batch) return res.status(404).json({ success: false, data: null, message: 'Batch not found' });
    res.status(200).json({ success: true, data: batch, message: 'Batch updated' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ success: false, data: null, message: 'Batch not found' });
    res.status(200).json({ success: true, data: null, message: 'Batch deleted' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const assignMentorToBatch = async (req, res) => {
  try {
    const { batchId, mentorId } = req.body;
    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { mentors: mentorId } },
      { new: true }
    );
    res.status(200).json({ success: true, data: batch, message: 'Mentor assigned' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const enrollStudentInBatch = async (req, res) => {
  try {
    const { batchId, studentId } = req.body;
    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { students: studentId } },
      { new: true }
    );
    res.status(200).json({ success: true, data: batch, message: 'Student enrolled' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = {
  createBatch, getBatches, updateBatch, deleteBatch,
  assignMentorToBatch, enrollStudentInBatch,
};
