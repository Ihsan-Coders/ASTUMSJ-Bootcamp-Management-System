const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const {
  createAlumniProfile,
  getPublicAlumni,
  updateAlumniProfile,
  deleteAlumniProfile,
} = require("../controllers/alumni.controller");
const validateObjectId = require("../middleware/validateObjectId.middleware");
router.get("/", getPublicAlumni);

router.post(
  "/",
  protect,
  authorize("admin"),
  createAlumniProfile
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId,
  updateAlumniProfile
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId,
  deleteAlumniProfile
);
module.exports = router;
