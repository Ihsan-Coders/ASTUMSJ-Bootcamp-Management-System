const Assignment = require('../models/Assignment');
const { syncAssignmentDeadline } = require('../services/calendar.service');
const asyncHandler = require('../utils/asyncHandler');

const createAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.create({ ...req.body, createdBy: req.user.id });
    await syncAssignmentDeadline(assignment); // keeps M2's calendar in sync automatically
    res.status(201).json({ success: true, data: assignment, message: 'Assignment created' });
})

const getAssignments = asyncHandler(async (req, res) => {
    const { batchId } = req.query;
    const filter = batchId ? { batch: batchId } : {};
    const assignments = await Assignment.find(filter).sort({ deadline: 1 });
    res.status(200).json({ success: true, data: assignments, message: 'Assignments fetched' });
 
})

const updateAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (assignment) await syncAssignmentDeadline(assignment); // keep calendar in sync on edits too
    res.status(200).json({ success: true, data: assignment, message: 'Assignment updated' });
 
})

const deleteAssignment = asyncHandler(async (req, res) => {
    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: null, message: 'Assignment deleted' });
  
})

module.exports = { createAssignment, getAssignments, updateAssignment, deleteAssignment };
