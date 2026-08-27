// Import the report generation functions from the report service.
const {
  generatePlatformReport,
  generatePDFReport,
} = require("../services/report.service");
const asyncHandler = require('../utils/asyncHandler');

// Handle GET /reports.
const getReport = asyncHandler(async (req, res) => {

    // Generate the platform report.
    const report = await generatePlatformReport();

    // Send the report as JSON.
    res.status(200).json({
      success: true,
      data: report,
      message: "Report generated",
    });
  
})

// Handle GET /reports/download.
const downloadReportPDF = asyncHandler(async (req, res) => {
    // Generate the report data.
    const reportData = await generatePlatformReport();

    // Create the PDF document.
    const pdf = generatePDFReport(reportData);

    // Tell the browser that this is a PDF file.
    res.setHeader("Content-Type", "application/pdf");

    // Tell the browser to download the file.
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="astu-msj-platform-report.pdf"',
    );

    // Pipe the PDF directly to the response.
    pdf.pipe(res);

    // Finalize the PDF.
    pdf.end();
  
})

// Export both report controllers.
module.exports = {
  getReport,
  downloadReportPDF,
};
