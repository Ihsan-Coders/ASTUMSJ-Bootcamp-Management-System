const Assignment = require('../models/Assignment');

const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: assignment, message: 'Assignment created' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { batchId } = req.query;
    const filter = batchId ? { batch: batchId } : {};
    const assignments = await Assignment.find(filter).sort({ deadline: 1 });
    res.status(200).json({ success: true, data: assignments, message: 'Assignments fetched' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: assignment, message: 'Assignment updated' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: null, message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { createAssignment, getAssignments, updateAssignment, deleteAssignment };
