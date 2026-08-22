// Import the report generation functions from the report service.
const {
  generatePlatformReport,
  generatePDFReport,
} = require("../services/report.service");

// Handle GET /reports.
const getReport = async (req, res) => {
  try {
    // Generate the platform report.
    const report = await generatePlatformReport();

    // Send the report as JSON.
    res.status(200).json({
      success: true,
      data: report,
      message: "Report generated",
    });
  } catch (err) {
    console.error("Error generating report:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Handle GET /reports/download.
const downloadReportPDF = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error generating PDF report:", err);

    // Only send JSON if the response hasn't already started.
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        data: null,
        message: err.message,
      });
    }
  }
};

// Export both report controllers.
module.exports = {
  getReport,
  downloadReportPDF,
};
