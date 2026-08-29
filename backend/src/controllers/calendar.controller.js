const CalendarEvent = require("../models/CalendarEvent");
const asyncHandler = require("../utils/asyncHandler");

// ======================================================
// CREATE EVENT
// Admin / Mentor only
// ======================================================

const createEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.create({
    ...req.body,
    batch: req.body.batch || null,
    createdBy: req.user.id,
  });

  const populated = await event.populate("batch", "name");

  res
    .status(201)
    .json({ success: true, data: populated, message: "Event created" });
});

// ======================================================
// GET EVENTS
// Admin / Mentor / Student
// ======================================================

const getEvents = asyncHandler(async (req, res) => {
  const { batchId } = req.query;

  let filter = {};

  if (req.user.role === "student") {
    // Students only ever see events scoped to their own batch, plus
    // batch-agnostic (global) events. Any batchId query param is
    // ignored for students so they cannot request another batch's
    // events.
    filter = req.user.batch
      ? { $or: [{ batch: req.user.batch }, { batch: null }] }
      : { batch: null };
  } else if (batchId) {
    filter = { batch: batchId };
  }

    const events = await CalendarEvent.find(filter)
    .populate("batch", "name")
    .populate("createdBy", "name email")
    .sort({ date: 1 });

  console.log("CALENDAR GET EVENTS FILTER:", JSON.stringify(filter, null, 2));
  console.log("CALENDAR GET EVENTS COUNT:", events.length);
  events.forEach(e => console.log(`EVENT: ${e.title}, TYPE: ${e.type}, BATCH: ${e.batch?._id}`));

  res
    .status(200)
    .json({ success: true, data: events, message: "Events fetched" });
});

// ======================================================
// UPDATE EVENT
// Admin / Mentor only
//
// Mentors can only edit events they created; admins can edit any
// manually-created event. AssignmentDeadline events are managed
// automatically by calendar.service.js and cannot be edited directly.
// ======================================================

const updateEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Event not found",
    });
  }

  if (event.type === "AssignmentDeadline") {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Assignment deadline events are managed automatically and cannot be edited directly.",
    });
  }

  if (
    req.user.role === "mentor" &&
    String(event.createdBy) !== String(req.user.id)
  ) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "You can only edit events you created.",
    });
  }

  const allowedFields = ["title", "description", "type", "date", "batch"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] =
        field === "batch" ? req.body[field] || null : req.body[field];
    }
  });

  await event.save();

  const populated = await event.populate("batch", "name");

  res
    .status(200)
    .json({ success: true, data: populated, message: "Event updated" });
});

// ======================================================
// DELETE EVENT
// Admin / Mentor only
//
// Mentors can only delete events they created; admins can delete any
// manually-created event. AssignmentDeadline events are managed
// automatically and cannot be deleted directly (they're removed when
// the related assignment is deleted).
// ======================================================

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Event not found",
    });
  }

  if (event.type === "AssignmentDeadline") {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Assignment deadline events are managed automatically and cannot be deleted directly.",
    });
  }

  if (
    req.user.role === "mentor" &&
    String(event.createdBy) !== String(req.user.id)
  ) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "You can only delete events you created.",
    });
  }

  await CalendarEvent.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json({ success: true, data: null, message: "Event deleted" });
});

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
