const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");
const { getVisibleAnnouncementsFilter } = require("../services/announcement.service");

// ======================================================
// CREATE ANNOUNCEMENT
// Admin / Mentor
// ======================================================
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, targetAudience, batch, publishDate } = req.body;

  const announcement = await Announcement.create({
    title,
    content,
    targetAudience,
    // Only persist a batch reference when the announcement actually
    // targets a specific batch — avoids stale/irrelevant batch refs.
    batch: targetAudience === "SpecificBatch" ? batch : null,
    publishDate: publishDate || Date.now(),
    createdBy: req.user.id,
  });

  await announcement.populate("createdBy", "name email");
  await announcement.populate("batch", "name");

  res.status(201).json({
    success: true,
    data: announcement,
    message: "Announcement created",
  });
});

// ======================================================
// GET ANNOUNCEMENTS
// Admin / Mentor: full management view (all announcements)
// Student: only announcements targeted at them, already published
// ======================================================
const getAnnouncements = asyncHandler(async (req, res) => {
  const filter = await getVisibleAnnouncementsFilter(req.user);

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "name email")
    .populate("batch", "name")
    .sort({ publishDate: -1 });

  res.status(200).json({
    success: true,
    data: announcements,
    message: "Announcements fetched",
  });
});

// ======================================================
// UPDATE ANNOUNCEMENT
// Admin: can edit any announcement
// Mentor: can only edit announcements they created
// ======================================================
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Announcement not found",
    });
  }

  if (
    req.user.role !== "admin" &&
    String(announcement.createdBy) !== String(req.user.id)
  ) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "You can only edit announcements you created.",
    });
  }

  const allowedFields = [
    "title",
    "content",
    "targetAudience",
    "batch",
    "publishDate",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      announcement[field] = req.body[field];
    }
  });

  // Keep batch consistent with audience — clear any stale batch
  // reference when the announcement no longer targets a specific batch.
  if (announcement.targetAudience !== "SpecificBatch") {
    announcement.batch = null;
  } else if (!announcement.batch) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "A batch must be selected for a batch-specific announcement.",
    });
  }

  await announcement.save();

  await announcement.populate("createdBy", "name email");
  await announcement.populate("batch", "name");

  res.status(200).json({
    success: true,
    data: announcement,
    message: "Announcement updated",
  });
});

// ======================================================
// DELETE ANNOUNCEMENT
// Admin: can delete any announcement
// Mentor: can only delete announcements they created
// ======================================================
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Announcement not found",
    });
  }

  if (
    req.user.role !== "admin" &&
    String(announcement.createdBy) !== String(req.user.id)
  ) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "You can only delete announcements you created.",
    });
  }

  await Announcement.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: null,
    message: "Announcement deleted",
  });
});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
