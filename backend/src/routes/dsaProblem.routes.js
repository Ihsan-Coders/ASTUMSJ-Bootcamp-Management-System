const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  createDSAProblem,
  getDSAProblems,
  getMyDSAProblems,
  getWeeklyDSAActivity,
} = require("../controllers/dsaProblem.controller");

const {
  createDSAProblemSchema,
} = require("../validators/dsaProblem.validator");


router.use(protect);


// ============================================================
// STUDENT CREATES DSA PROBLEM
// ============================================================

router.post(
  "/",
  authorize("student"),
  validate(createDSAProblemSchema),
  createDSAProblem,
);


// ============================================================
// STUDENT GETS THEIR OWN ACTIVITY
// ============================================================

router.get(
  "/mine",
  authorize("student"),
  getMyDSAProblems,
);


// ============================================================
// WEEKLY DSA ACTIVITY
// ============================================================

router.get(
  "/weekly",
  authorize("admin", "mentor", "student"),
  getWeeklyDSAActivity,
);


// ============================================================
// GET DSA PROBLEMS
// ============================================================

router.get(
  "/",
  authorize("admin", "mentor", "student"),
  getDSAProblems,
);


module.exports = router;
