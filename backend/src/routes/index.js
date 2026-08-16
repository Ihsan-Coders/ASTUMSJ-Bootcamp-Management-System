const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const resourceRoutes = require("./resource.routes");
const alumniRoutes = require("./alumni.routes");
router.use("/resources", resourceRoutes);
router.use("/alumni", alumniRoutes);
router.use("/auth", authRoutes);
module.exports = router;
