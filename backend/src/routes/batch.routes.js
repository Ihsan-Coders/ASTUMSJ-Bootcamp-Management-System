const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createBatch,
  getBatches,
  getOpenBatches,
  updateBatch,
  deleteBatch,
  assignMentorToBatch,
  enrollStudentInBatch,
  assignMentorToStudent,
  setAcceptingBatch,
} = require("../controllers/batch.controller");

const validate = require("../middleware/validate.middleware");

const {
  createBatchSchema,
  updateBatchSchema,
} = require("../validators/batch.validator");

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get batches currently accepting applicants
// Used by the registration form
router.get("/open", getOpenBatches);

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// ============================================================
// GET ALL BATCHES
// ============================================================

router.get("/", authorize("admin", "mentor"), getBatches);

// ============================================================
// CREATE BATCH
// ============================================================

router.post("/", authorize("admin"), validate(createBatchSchema), createBatch);

// ============================================================
// UPDATE BATCH
// ============================================================

router.put(
  "/:id",
  authorize("admin"),
  validate(updateBatchSchema),
  updateBatch,
);

// ============================================================
// DELETE BATCH
// ============================================================

router.delete("/:id", authorize("admin"), deleteBatch);

// ============================================================
// ASSIGN MENTOR TO BATCH
// ============================================================

router.post("/assign-mentor", authorize("admin"), assignMentorToBatch);

// ============================================================
// ENROLL STUDENT IN BATCH
// ============================================================

router.post("/enroll-student", authorize("admin"), enrollStudentInBatch);

// ============================================================
// ASSIGN MENTOR TO STUDENT
// ============================================================

router.post(
  "/assign-mentor-to-student",
  authorize("admin"),
  assignMentorToStudent,
);

// ============================================================
// SET BATCH AS ACCEPTING APPLICANTS
// ============================================================

router.put("/:id/set-accepting", authorize("admin"), setAcceptingBatch);

module.exports = router;
