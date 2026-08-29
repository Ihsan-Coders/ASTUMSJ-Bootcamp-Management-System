const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Batch = require("../models/Batch");
const CalendarEvent = require("../models/CalendarEvent");

const {
  calculateAttendancePercentage,
  isAtRisk,
} = require("../services/attendance.service");

const asyncHandler = require("../utils/asyncHandler");

const normalizeDate = (date) => {
  const normalized = new Date(date);

  if (Number.isNaN(normalized.getTime())) {
    return null;
  }

  normalized.setHours(0, 0, 0, 0);

  return normalized;
};

// ======================================================
// MARK ONE STUDENT
// ======================================================

const markAttendance = asyncHandler(async (req, res) => {
  const {
    student,
    batch,
    session,
    status,
    calendarEvent,
  } = req.body;


  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Only admins can mark attendance",
    });
  }

  if (!calendarEvent) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "A calendar session is required to mark attendance",
    });
  }

  if (!["start", "end"].includes(session)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Session must be either start or end",
    });
  }

  if (
    !["Present", "Absent", "Late", "Excused"].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid attendance status",
    });
  }

  const event = await CalendarEvent.findById(calendarEvent);

  if (!event) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Calendar session not found",
    });
  }

  if (event.type !== "Session") {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Attendance can only be marked for a session event",
    });
  }

  if (
    event.batch &&
    String(event.batch) !== String(batch)
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Calendar session does not belong to this batch",
    });
  }

    const normalizedDate = normalizeDate(event.date);

  if (!normalizedDate) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid attendance date",
    });
  }

  const batchRecord = await Batch.findById(batch);

  if (!batchRecord) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  if (!batchRecord.isActive) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Attendance cannot be marked for a completed batch",
    });
  }

  const studentRecord = await User.findById(student);

  if (
    !studentRecord ||
    studentRecord.role !== "student"
  ) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Student not found",
    });
  }

  const studentBelongsToBatch =
    batchRecord.students.some(
      (studentId) =>
        studentId.toString() === student.toString(),
    );

  if (!studentBelongsToBatch) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Student does not belong to this batch",
    });
  }

  const existingRecord =
    await Attendance.findOne({
      student,
      calendarEvent,
      session,
    });

  if (existingRecord) {
    return res.status(409).json({
      success: false,
      data: existingRecord,
      message: `Attendance already marked for this student's ${session} session`,
    });
  }

  const record = await Attendance.create({
    student,
    batch,
    calendarEvent,
    date: normalizedDate,
    session,
    status,
    markedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: record,
    message: "Attendance marked successfully",
  });
});

// ======================================================
// BULK ATTENDANCE
// ======================================================

const markBulkAttendance = asyncHandler(async (req, res) => {
  const {
    batch,
    session,
    calendarEvent,
    attendance,
  } = req.body;


  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Only admins can mark attendance",
    });
  }

    if (
    !batch ||
    !session ||
    !calendarEvent ||
    !Array.isArray(attendance)
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Batch, session, calendar event and attendance are required",
    });
  }

  if (!["start", "end"].includes(session)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Session must be either start or end",
    });
  }

    const normalizedDate = normalizeDate(calendarRecord.date);

  if (!normalizedDate) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid attendance date",
    });
  }

  const calendarRecord =
    await CalendarEvent.findById(calendarEvent);

  if (!calendarRecord) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Calendar session not found",
    });
  }

  if (calendarRecord.type !== "Session") {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Attendance can only be marked for a session event",
    });
  }

  if (
    calendarRecord.batch &&
    String(calendarRecord.batch) !== String(batch)
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Calendar session does not belong to this batch",
    });
  }

  const batchRecord = await Batch.findById(batch).populate(
    "students",
    "_id name email role batch",
  );

  if (!batchRecord) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Batch not found",
    });
  }

  if (!batchRecord.isActive) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Attendance cannot be marked for a completed batch",
    });
  }

  if (attendance.length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "No attendance records were provided",
    });
  }

  const batchStudentIds = new Set(
    batchRecord.students.map((student) =>
      student._id.toString(),
    ),
  );

  for (const item of attendance) {
    if (
      !item.student ||
      !batchStudentIds.has(item.student.toString())
    ) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "One or more students do not belong to this batch",
      });
    }

    if (
      !["Present", "Absent", "Late", "Excused"].includes(
        item.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid attendance status",
      });
    }
  }

  const operations = attendance.map((item) => ({
    updateOne: {
      filter: {
        student: item.student,
        calendarEvent,
        session,
      },

      update: {
        $set: {
          status: item.status,
          markedBy: req.user.id,
          batch,
          date: normalizedDate,
        },

        $setOnInsert: {
          student: item.student,
          calendarEvent,
          session,
        },
      },

      upsert: true,
    },
  }));

  await Attendance.bulkWrite(operations);

  const records = await Attendance.find({
    calendarEvent,
    session,
  })
    .populate("student", "name email")
    .populate("batch", "name")
    .populate("calendarEvent", "title date type")
    .populate("markedBy", "name")
    .sort({ "student.name": 1 });

  res.status(200).json({
    success: true,
    data: records,
    message: `${
      session === "start" ? "Start" : "End"
    } session attendance saved successfully`,
  });
});

// ======================================================
// UPDATE
// ======================================================

const updateAttendance = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Only admins can update attendance",
    });
  }

  const record = await Attendance.findById(
    req.params.id,
  );

  if (!record) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Attendance record not found",
    });
  }

  const batch = await Batch.findById(record.batch);

  if (!batch || !batch.isActive) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        "Attendance from a completed batch cannot be modified",
    });
  }

  const allowedUpdates = {};

  if (req.body.status !== undefined) {
    if (
      !["Present", "Absent", "Late", "Excused"].includes(
        req.body.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid attendance status",
      });
    }

    allowedUpdates.status = req.body.status;
  }

  const updatedRecord =
    await Attendance.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      },
    );

  res.status(200).json({
    success: true,
    data: updatedRecord,
    message: "Attendance updated successfully",
  });
});

// ======================================================
// HISTORY
// ======================================================

const getAttendanceHistory = asyncHandler(
  async (req, res) => {
    const {
      studentId,
      batchId,
      date,
      session,
      calendarEvent,
    } = req.query;

    const filter = {};

    if (req.user.role === "student") {
      filter.student = req.user.id;
    }

    if (req.user.role === "mentor") {
      const mentorBatches = await Batch.find({
        mentors: req.user.id,
      }).select("_id");

      const mentorBatchIds = mentorBatches.map(
        (batch) => batch._id,
      );

      if (batchId) {
        const allowedBatch = mentorBatchIds.some(
          (id) => id.toString() === batchId,
        );

        if (!allowedBatch) {
          return res.status(403).json({
            success: false,
            data: null,
            message:
              "You are not assigned to this batch",
          });
        }

        filter.batch = batchId;
      } else {
        filter.batch = {
          $in: mentorBatchIds,
        };
      }

      if (studentId) {
        const student = await User.findOne({
          _id: studentId,
          role: "student",
          batch: { $in: mentorBatchIds },
        });

        if (!student) {
          return res.status(403).json({
            success: false,
            data: null,
            message:
              "You cannot view this student's attendance",
          });
        }

        filter.student = studentId;
      }
    }

    if (req.user.role === "admin") {
      if (studentId) {
        filter.student = studentId;
      }

      if (batchId) {
        filter.batch = batchId;
      }
    }

    if (calendarEvent) {
      filter.calendarEvent = calendarEvent;
    }

    if (date) {
      const normalizedDate = normalizeDate(calendarRecord.date);

      if (!normalizedDate) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Invalid date",
        });
      }

      const nextDate = new Date(normalizedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      filter.date = {
        $gte: normalizedDate,
        $lt: nextDate,
      };
    }

    if (session) {
      filter.session = session;
    }

    const records = await Attendance.find(filter)
      .populate("student", "name email")
      .populate("batch", "name")
      .populate(
        "calendarEvent",
        "title date type batch",
      )
      .populate("markedBy", "name")
      .sort({
        date: -1,
        session: 1,
      });

    const percentage =
      calculateAttendancePercentage(records);

    res.status(200).json({
      success: true,
      data: {
        records,
        percentage,
        isAtRisk: isAtRisk(percentage),
      },
      message: "Attendance fetched",
    });
  },
);

// ======================================================
// DELETE
// ======================================================

const deleteAttendance = asyncHandler(
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        data: null,
        message:
          "Only admins can delete attendance",
      });
    }

    const record = await Attendance.findById(
      req.params.id,
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Attendance record not found",
      });
    }

    const batch = await Batch.findById(record.batch);

    if (!batch || !batch.isActive) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "Attendance from a completed batch cannot be deleted",
      });
    }

    await Attendance.findByIdAndDelete(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      data: record,
      message: "Attendance deleted successfully",
    });
  },
);

module.exports = {
  markAttendance,
  markBulkAttendance,
  updateAttendance,
  getAttendanceHistory,
  deleteAttendance,
};