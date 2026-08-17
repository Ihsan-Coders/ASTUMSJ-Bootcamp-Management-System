const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createEvent,
  getEvents,
} = require("../controllers/calendar.controller");

router.use(protect);
router.post("/", createEvent);
router.get("/", getEvents);

module.exports = router;
