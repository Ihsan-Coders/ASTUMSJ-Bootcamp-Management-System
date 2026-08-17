const CalendarEvent = require("../models/CalendarEvent");

const createEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, data: event, message: "Event created" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const { batchId } = req.query;
    const filter = batchId ? { batch: batchId } : {};
    const events = await CalendarEvent.find(filter).sort({ date: 1 });
    res
      .status(200)
      .json({ success: true, data: events, message: "Events fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { createEvent, getEvents };
