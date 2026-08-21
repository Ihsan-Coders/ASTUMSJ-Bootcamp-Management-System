const Attendance = require("../models/Attendance");
const {calculateAttendancePercentage} = require("../services/attendance.service");
const asyncHandler = require('../utils/asyncHandler');

const markAttendance = asyncHandler(async (req, res) => {
    const { student, batch, date, status } = req.body;
    const record = await Attendance.create({
      student,
      batch,
      date,
      status,
      markedBy: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, data: record, message: "Attendance marked" });
  
})

const updateAttendance = asyncHandler(async (req, res) => {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!record)
      return res
        .status(404)
        .json({ success: false, data: null, message: "Record not found" });
    res
      .status(200)
      .json({ success: true, data: record, message: "Attendance updated" });
})

const getAttendanceHistory = asyncHandler(async (req, res) => {
    const { studentId, batchId } = req.query;
    const filter = {};
    if (studentId) filter.student = studentId;
    if (batchId) filter.batch = batchId;

    const records = await Attendance.find(filter).sort({ date: -1 });
    const percentage = calculateAttendancePercentage(records);

    res
      .status(200)
      .json({
        success: true,
        data: { records, percentage },
        message: "Attendance fetched",
      });
})

module.exports = { markAttendance, updateAttendance, getAttendanceHistory };
