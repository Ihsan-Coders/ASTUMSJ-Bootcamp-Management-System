const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const { getLeaderboard } = require("../controllers/leaderboard.controller");

router.use(protect);

router.get("/", authorize("admin", "mentor", "student"), getLeaderboard);

module.exports = router;
