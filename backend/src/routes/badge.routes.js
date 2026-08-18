const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { getStudentBadges } = require("../controllers/badge.controller");

router.use(protect);
router.get("/me", getStudentBadges);
router.get("/:studentId", getStudentBadges);

module.exports = router;
