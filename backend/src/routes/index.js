const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const resourceRoutes = require("./resource.routes");
const alumniRoutes = require("./alumni.routes");
const batchRoutes = require("./batch.routes");
const userRoutes = require("./user.routes");

router.use("/resources", resourceRoutes);
router.use("/alumni", alumniRoutes);
router.use("/batches", batchRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/attendance", require("./attendance.routes"));
router.use("/calendar", require("./calendar.routes"));

module.exports = router;
