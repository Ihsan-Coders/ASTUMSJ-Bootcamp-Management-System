const express = require("express");

const router = express.Router();

// Authentication middleware.
const protect = require("../middleware/auth.middleware");

// Role authorization middleware.
const authorize = require("../middleware/role.middleware");

// Import the report controller.
const { getReport } = require("../controllers/report.controller");

// The user must be logged in AND must have the admin role.
router.use(protect, authorize("admin"));

// GET /api/reports
router.get("/", getReport);

// Export the router.
module.exports = router;
