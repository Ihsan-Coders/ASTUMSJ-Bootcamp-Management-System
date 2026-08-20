const User = require("../models/User");
const Batch = require("../models/Batch");
const Attendance = require("../models/Attendance");
const Submission = require("../models/Submission");

// Generate analytics for every batch on the platform.
const generatePlatformReport = async () => {
  // Get all batches.
  const batches = await Batch.find();

  // Generate a report for each batch.
  const batchReports = await Promise.all(
    batches.map(async (batch) => {
      // Find all students belonging to this batch.
      const students = await User.find({
        _id: { $in: batch.students },
      });

      // Find attendance records belonging to this batch.
      const attendance = await Attendance.find({
        batch: batch._id,
      });

      // Count students/records marked Present.
      const present = attendance.filter((a) => a.status === "Present").length;

      // Only Present, Absent and Late records
      // are included in the attendance calculation.
      const applicable = attendance.filter((a) =>
        ["Present", "Absent", "Late"].includes(a.status),
      ).length;

      // Calculate attendance rate for this batch.
      const attendanceRate =
        applicable > 0 ? Math.round((present / applicable) * 100) : 0;

      // Return the information needed by the report.
      return {
        batchName: batch.name,
        studentCount: students.length,
        attendanceRate,
      };
    }),
  );

  // Return the complete platform report.
  return {
    generatedAt: new Date(),
    batchReports,
  };
};

// Export the service so the controller can use it.
module.exports = {
  generatePlatformReport,
};
