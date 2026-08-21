const express = require("express");

const router = express.Router();

const authRoutes = require("./auth.routes");
const resourceRoutes = require("./resource.routes");
const alumniRoutes = require("./alumni.routes");
const batchRoutes = require("./batch.routes");
const userRoutes = require("./user.routes");

const assignmentRoutes = require("./assignment.routes");
const submissionRoutes = require("./submission.routes");
const leaderboardRoutes = require("./leaderboard.routes");

router.use("/mentor-notes", require("./mentorNote.routes"));
router.use("/badges", require("./badge.routes"));
router.use("/resources", resourceRoutes);
router.use("/alumni", alumniRoutes);
router.use("/batches", batchRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", require("./dashboard.routes"));
router.use("/announcements", require("./announcement.routes"));
router.use("/assignments", assignmentRoutes);
router.use("/submissions", submissionRoutes);
router.use("/leaderboard", leaderboardRoutes);

module.exports = router;
