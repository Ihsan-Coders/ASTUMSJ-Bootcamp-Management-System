// Import the functions used to generate JSON reports and PDF reports.
const {
  generatePlatformReport,
  generatePDFReport,
} = require("../services/report.service");

// Generate the platform report and send it as a PDF file.
const downloadReportPDF = async (req, res) => {
  try {
    // Get the report data from the report service.
    const report = await generatePlatformReport();

    // Convert the report data into a PDF document.
    const doc = generatePDFReport(report);

    // Tell the browser that the response is a PDF.
    res.setHeader("Content-Type", "application/pdf");

    // Tell the browser to download the file
    // instead of displaying it as normal JSON.
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bootcamp-report.pdf",
    );

    // Send the PDF document to the browser.
    doc.pipe(res);

    // Finish creating the PDF.
    doc.end();
  } catch (err) {
    // Return an error if PDF generation fails.
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};
// Export both report controllers.
module.exports = {
  getReport,
  downloadReportPDF,
};
