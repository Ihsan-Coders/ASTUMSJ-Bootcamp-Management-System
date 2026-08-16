const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const {
  createAlumniProfile,
  getPublicAlumni,
} = require("../controllers/alumni.controller");
router.get("/", getPublicAlumni); // public — no login needed, this is the public alumni page
router.post("/", protect, authorize("admin"), createAlumniProfile);
module.exports = router;
