const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const {
  createResource,
  getResources,
  deleteResource,
} = require("../controllers/resource.controller");
router.use(protect);
router.post("/", authorize("admin", "mentor"), createResource);
router.get("/", getResources); // all logged-in roles can browse
router.delete("/:id", authorize("admin", "mentor"), deleteResource);
module.exports = router;
