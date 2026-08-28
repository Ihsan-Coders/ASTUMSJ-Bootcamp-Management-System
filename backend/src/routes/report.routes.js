const express = require("express");

const router = express.Router();

// Authentication middleware.
const protect = require("../middleware/auth.middleware");

// Role authorization middleware.
const authorize = require("../middleware/role.middleware");

// Import the report controller.
const { getReport, downloadReportPDF } = require("../controllers/report.controller");

// The user must be logged in AND must have the admin role.
router.use(protect, authorize("admin"));

// GET /api/reports
router.get("/", getReport);

// GET /api/reports/pdf — matches what ExportPdfButton.jsx actually calls.
// downloadReportPDF was fully implemented but never mounted here.
router.get("/pdf", downloadReportPDF);

// Export the router.
module.exports = router;
