const Attendance = require("../models/Attendance");
const {
  calculateAttendancePercentage,
} = require("../services/attendance.service");

const markAttendance = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getAttendanceHistory = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { markAttendance, updateAttendance, getAttendanceHistory };
