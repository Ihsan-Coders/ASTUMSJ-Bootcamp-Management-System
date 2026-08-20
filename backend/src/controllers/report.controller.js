// Import the function that generates our platform report.
const { generatePlatformReport } = require("../services/report.service");

// Handle the GET /reports request.
const getReport = async (req, res) => {
  try {
    // Ask the report service to generate the report.
    const report = await generatePlatformReport();

    // Send the report to the client.
    res.status(200).json({
      success: true,
      data: report,
      message: "Report generated",
    });
  } catch (err) {
    // Return an error if report generation fails.
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

// Export the controller.
module.exports = {
  getReport,
};
