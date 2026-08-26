const Assignment = require("../models/Assignment");
const Batch = require("../models/Batch");

const { syncAssignmentDeadline } = require("../services/calendar.service");
const { createNotification } = require("../services/notification.service");

const asyncHandler = require("../utils/asyncHandler");

// ======================================================
// CREATE ASSIGNMENT
// Admin only
// ======================================================

const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create({
    ...req.body,
    createdBy: req.user.id,
  });

  await syncAssignmentDeadline(assignment);

  // Notify every student in the assignment's batch. Only fires on
  // creation (not on edits) so updating an assignment never re-spams
  // the batch.
  if (assignment.batch) {
    const batch = await Batch.findById(assignment.batch).select("students");

    await Promise.all(
      (batch?.students || []).map((studentId) =>
        createNotification({
          userId: studentId,
          type: "NewAssignment",
          message: `New assignment posted: "${assignment.title}"`,
          relatedId: assignment._id,
        }),
      ),
    );
  }

  res.status(201).json({
    success: true,
    data: assignment,
    message: "Assignment created",
  });
});

// ======================================================
// GET ASSIGNMENTS
// Admin / Mentor / Student
// ======================================================

const getAssignments = asyncHandler(async (req, res) => {
  const { batchId } = req.query;

  const filter = batchId ? { batch: batchId } : {};

  const assignments = await Assignment.find(filter)
    .populate("createdBy", "name email")
    .populate("batch", "name")
    .sort({ deadline: 1 });

  res.status(200).json({
    success: true,
    data: assignments,
    message: "Assignments fetched",
  });
});

// ======================================================
// UPDATE ASSIGNMENT
// Admin only
//
// Admin manages all assignments regardless of which mentor originally
// created them, so there is no createdBy ownership check here.
// ======================================================

const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Assignment not found",
    });
  }

  const allowedFields = [
    "title",
    "description",
    "instructions",
    "batch",
    "deadline",
    "maxScore",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      assignment[field] = req.body[field];
    }
  });

  await assignment.save();

  await syncAssignmentDeadline(assignment);

  res.status(200).json({
    success: true,
    data: assignment,
    message: "Assignment updated",
  });
});

// ======================================================
// DELETE ASSIGNMENT
// Admin only
//
// Admin manages all assignments regardless of which mentor originally
// created them, so there is no createdBy ownership check here.
// ======================================================

const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Assignment not found",
    });
  }

  await Assignment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: null,
    message: "Assignment deleted",
  });
});

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
};