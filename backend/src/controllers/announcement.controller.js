const Announcement = require("../models/Announcement");
const CalendarEvent = require("../models/CalendarEvent");
const Attendance = require("../models/Attendance");


const asyncHandler = require("../utils/asyncHandler");

const {
  getVisibleAnnouncementsFilter,
  getAnnouncementRecipientIds,
} = require("../services/announcement.service");

const { createNotification } = require("../services/notification.service");

// ======================================================
// CREATE ANNOUNCEMENT
// Admin / Mentor
// ======================================================

const createAnnouncement = asyncHandler(async (req, res) => {
    const {
      title,
      content,
      targetAudience,
      batch,
      publishDate,
      isSession,
      sessionDate,
    } = req.body;

    const creatingSession = Boolean(isSession);

    if (creatingSession && !sessionDate) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Session date and time are required for a class session.",
    });
  }

  if (creatingSession && !batch) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "A batch is required for a class session.",
    });
  }

  if (
    creatingSession &&
    targetAudience !== "SpecificBatch"
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "A class session announcement must target a specific batch.",
    });
  }

    console.log("DEBUG: Controller received batch:", batch, typeof batch);

  const announcement = await Announcement.create({
    title,
    content,
    targetAudience,
    batch:
      targetAudience === "SpecificBatch" || creatingSession
        ? batch
        : null,
    publishDate: publishDate || Date.now(),
    isSession: creatingSession,
    sessionDate: creatingSession ? sessionDate : null,
    createdBy: req.user.id,
  });

  console.log("DEBUG: Announcement created, batch in doc:", announcement.batch);


    // ======================================================
    // CREATE CALENDAR SESSION
  // ======================================================

  if (creatingSession) {
    console.log("DEBUG: ENTERED SESSION CREATION BLOCK");
    console.log("CREATING CALENDAR EVENT WITH BATCH:", batch, typeof batch);
    const calendarEvent = await CalendarEvent.create({
      title,
      description: content,
      type: "Session",
      date: sessionDate,
      batch,
      relatedAnnouncement: announcement._id,
      createdBy: req.user.id,
    });

    console.log( "CALENDAR EVENT CREATED - BATCH:", calendarEvent.batch, "EVENT ID:", calendarEvent._id );

    announcement.calendarEvent = calendarEvent._id;

    await announcement.save();
  }

  await announcement.populate("createdBy", "name email");
  await announcement.populate("batch", "name");
  await announcement.populate("calendarEvent");

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const recipientIds =
    await getAnnouncementRecipientIds(announcement);

  const notifyIds = recipientIds.filter(
    (id) => String(id) !== String(req.user.id),
  );

  await Promise.all(
    notifyIds.map((userId) =>
      createNotification({
        userId,
        type: "Announcement",
        message: `New announcement: "${announcement.title}"`,
        relatedId: announcement._id,
      }),
    ),
  );

  res.status(201).json({
    success: true,
    data: announcement,
    message: creatingSession
      ? "Announcement published and class session added to calendar."
      : "Announcement created",
  });
});

// ======================================================
// GET ANNOUNCEMENTS
// ======================================================

const getAnnouncements = asyncHandler(async (req, res) => {
  const filter = await getVisibleAnnouncementsFilter(req.user);

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "name email")
    .populate("batch", "name")
    .populate("calendarEvent")
    .sort({ publishDate: -1 });

  res.status(200).json({
    success: true,
    data: announcements,
    message: "Announcements fetched",
  });
});

// ======================================================
// UPDATE ANNOUNCEMENT
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
    "isSession",
    "sessionDate",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      announcement[field] = req.body[field];
    }
  });

  // ======================================================
  // VALIDATE SESSION
  // ======================================================

  if (announcement.isSession) {
    if (!announcement.sessionDate) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "Session date and time are required for a class session.",
      });
    }

    if (!announcement.batch) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "A batch is required for a class session.",
      });
    }

    if (announcement.targetAudience !== "SpecificBatch") {
      announcement.targetAudience = "SpecificBatch";
    }
  }

  // Keep batch consistent with normal announcements.
  if (
    !announcement.isSession &&
    announcement.targetAudience !== "SpecificBatch"
  ) {
    announcement.batch = null;
  }

  // ======================================================
  // CALENDAR EVENT SYNC
  // ======================================================

  if (announcement.isSession) {
        if (announcement.calendarEvent) {
      // Check if attendance exists to lock batch
      if (req.body.batch && String(req.body.batch) !== String(announcement.batch)) {
        const attendanceExists = await Attendance.exists({
          calendarEvent: announcement.calendarEvent,
        });

        if (attendanceExists) {
          return res.status(400).json({
            success: false,
            data: null,
            message:
              "Cannot change the batch of a session after attendance has been recorded.",
          });
        }
      }

      await CalendarEvent.findByIdAndUpdate(
        announcement.calendarEvent,
        {
          title: announcement.title,
          description: announcement.content,
          type: "Session",
          date: announcement.sessionDate,
          batch: announcement.batch,
        },
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      const calendarEvent = await CalendarEvent.create({
        title: announcement.title,
        description: announcement.content,
        type: "Session",
        date: announcement.sessionDate,
        batch: announcement.batch,
        relatedAnnouncement: announcement._id,
        createdBy: announcement.createdBy,
      });

      announcement.calendarEvent = calendarEvent._id;
    }
  } else if (announcement.calendarEvent) {
    // The announcement was changed from a session
    // into a normal announcement.
    await CalendarEvent.findByIdAndDelete(
      announcement.calendarEvent,
    );

    announcement.calendarEvent = null;
    announcement.sessionDate = null;
  }

  await announcement.save();

  await announcement.populate("createdBy", "name email");
  await announcement.populate("batch", "name");
  await announcement.populate("calendarEvent");

  res.status(200).json({
    success: true,
    data: announcement,
    message: "Announcement updated",
  });
});

// ======================================================
// DELETE ANNOUNCEMENT
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

    // Prevent deletion if session has attendance
  if (announcement.calendarEvent) {
    const attendanceExists = await Attendance.exists({
      calendarEvent: announcement.calendarEvent,
    });

    if (attendanceExists) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "Cannot delete this session because attendance has already been recorded. Sessions with attendance cannot be deleted because they are part of historical attendance records.",
      });
    }

    // Delete the linked calendar session if no attendance exists
    await CalendarEvent.findByIdAndDelete(
      announcement.calendarEvent,
    );
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