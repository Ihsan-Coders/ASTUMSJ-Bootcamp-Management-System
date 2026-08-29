const User = require("../models/User");
const Batch = require("../models/Batch");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// PDFKit allows us to create PDF documents on the backend.
const PDFDocument = require("pdfkit");

/**
 * Generate the main platform report.
 *
 * This collects summary information for every batch,
 * including student count and attendance rate.
 */
const generatePlatformReport = async () => {
  // Get all batches.
  const batches = await Batch.find().lean();

  // Generate a report for each batch.
  const batchReports = await Promise.all(
    batches.map(async (batch) => {
      // Find students belonging to this batch.
      const students = await User.find({
        batch: batch._id,
        role: "student",
      }).lean();

      // Find attendance records for this batch.
      const attendanceRecords = await Attendance.find({
        batch: batch._id,
      }).lean();

      // Calculate attendance rate.
      let attendanceRate = 0;

      if (attendanceRecords.length > 0) {
        const presentCount = attendanceRecords.filter(
          (record) => record.status === "Present",
        ).length;

        attendanceRate = Math.round(
          (presentCount / attendanceRecords.length) * 100,
        );
      }

      return {
        batchId: batch._id,
        batchName: batch.name || batch.batchName || "Unnamed Batch",
        studentCount: students.length,
        attendanceRate,
      };
    }),
  );

  // Get platform-level totals.
  const totalUsers = await User.countDocuments();

  const totalStudents = await User.countDocuments({
    role: "student",
  });

  const totalMentors = await User.countDocuments({
    role: "mentor",
  });

  const totalBatches = await Batch.countDocuments();

  const totalSubmissions = await Submission.countDocuments();

  // Assignment statistics. Per the SRS, Assignment.maxScore is NOT fixed
  // to 100 (can be 5, 10, 20, 30, 100, etc.) — so an average score has to
  // be normalized against each submission's own assignment.maxScore
  // rather than averaged as raw point values, which would be meaningless
  // across assignments with different scales.
  const totalAssignments = await Assignment.countDocuments();

  const gradedSubmissions = await Submission.countDocuments({ status: "Graded" });
  const pendingSubmissions = await Submission.countDocuments({ status: "Submitted" });
  const resubmissionRequested = await Submission.countDocuments({
    status: "Resubmission Requested",
  });

  const gradedWithScores = await Submission.find({
    status: "Graded",
    score: { $ne: null },
  })
    .select("score assignment")
    .populate("assignment", "maxScore")
    .lean();

  const validScores = gradedWithScores.filter(
    (s) => s.assignment?.maxScore > 0,
  );
  const averageScorePercent =
    validScores.length > 0
      ? Math.round(
          (validScores.reduce(
            (sum, s) => sum + s.score / s.assignment.maxScore,
            0,
          ) /
            validScores.length) *
            100,
        )
      : null;

  // Return the complete report.
  return {
    generatedAt: new Date(),
    summary: {
      totalUsers,
      totalStudents,
      totalMentors,
      totalBatches,
      totalSubmissions,
    },
    assignmentStats: {
      totalAssignments,
      gradedSubmissions,
      pendingSubmissions,
      resubmissionRequested,
      averageScorePercent, // null when there's nothing graded yet — don't show a misleading 0%
    },
    batchReports,
  };
};

/**
 * Generate a PDF document from report data.
 */
const generatePDFReport = (reportData) => {
  // Create a new PDF document.
  const doc = new PDFDocument({
    margin: 50,
  });

  // Add the report title.
  doc.fontSize(20).text("ASTU MSJ Bootcamp - Platform Report", {
    align: "center",
  });

  // Add some vertical space.
  doc.moveDown();

  // Add the date/time when the report was generated.
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, {
      align: "center",
    });

  doc.moveDown(2);

  // Platform summary.
  if (reportData.summary) {
    doc.fontSize(16).fillColor("black").text("Platform Summary");

    doc.moveDown(0.5);

    doc.fontSize(11).text(`Total Users: ${reportData.summary.totalUsers}`);

    doc.text(`Total Students: ${reportData.summary.totalStudents}`);

    doc.text(`Total Mentors: ${reportData.summary.totalMentors}`);

    doc.text(`Total Batches: ${reportData.summary.totalBatches}`);

    doc.text(`Total Submissions: ${reportData.summary.totalSubmissions}`);

    doc.moveDown(2);
  }

  // Assignment statistics.
  if (reportData.assignmentStats) {
    const stats = reportData.assignmentStats;

    doc.fontSize(16).fillColor("black").text("Assignment Statistics");

    doc.moveDown(0.5);

    doc.fontSize(11).text(`Total Assignments: ${stats.totalAssignments}`);
    doc.text(`Graded Submissions: ${stats.gradedSubmissions}`);
    doc.text(`Pending Submissions: ${stats.pendingSubmissions}`);
    doc.text(`Resubmission Requested: ${stats.resubmissionRequested}`);
    doc.text(
      `Average Score: ${
        stats.averageScorePercent === null ? "N/A" : `${stats.averageScorePercent}%`
      }`,
    );

    doc.moveDown(2);
  }

  // Batch reports.
  doc.fontSize(16).fillColor("black").text("Batch Reports");

  doc.moveDown();

  if (!reportData.batchReports || reportData.batchReports.length === 0) {
    doc.fontSize(11).text("No batch reports available.");
  } else {
    reportData.batchReports.forEach((batch) => {
      doc.fontSize(14).fillColor("black").text(batch.batchName);

      doc.fontSize(11).text(`Students: ${batch.studentCount}`);

      doc.text(`Attendance Rate: ${batch.attendanceRate}%`);

      doc.moveDown();
    });
  }

  // Return the PDF document.
  return doc;
};

module.exports = {
  generatePlatformReport,
  generatePDFReport,
};
