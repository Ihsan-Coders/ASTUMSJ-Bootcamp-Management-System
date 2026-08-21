const User = require("../models/User");
const Batch = require("../models/Batch");
const Attendance = require("../models/Attendance");
const Submission = require("../models/Submission");

// PDFKit allows us to create PDF documents on the backend.
const PDFDocument = require("pdfkit");

// Create a PDF document from the report data.
const generatePDFReport = (reportData) => {
  // Create a new PDF document.
  // margin: 50 gives the PDF some space around the edges.
  const doc = new PDFDocument({
    margin: 50,
  });

  // Add the report title.
  doc.fontSize(20).text("ASTU MSJ Bootcamp — Platform Report", {
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

  // Add more vertical space before the batch reports.
  doc.moveDown(2);

  // Go through every batch report.
  reportData.batchReports.forEach((b) => {
    // Display the batch name.
    doc.fontSize(14).fillColor("black").text(b.batchName);

    // Display the number of students.
    doc.fontSize(11).text(`Students: ${b.studentCount}`);

    // Display the attendance percentage.
    doc.text(`Attendance Rate: ${b.attendanceRate}%`);

    // Add some space before the next batch.
    doc.moveDown();
  });

  // Return the PDF document.
  return doc;
};

// Export both report functions so controllers can use them.
module.exports = {
  generatePlatformReport,
  generatePDFReport,
};
