const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const { createContestSchema } = require("../validators/contest.validator");

const {
  createContest,
  getContests,
  getContestById,
  fetchResults,
  getContestLeaderboard,
} = require("../controllers/contest.controller");

router.use(protect);

router.post(
  "/",
  authorize("admin"),
  validate(createContestSchema),
  createContest,
);

router.get("/", getContests);

router.get("/:id", getContestById);

router.post("/:id/fetch-results", authorize("admin"), fetchResults);

router.get("/:id/leaderboard", getContestLeaderboard);

module.exports = router;
