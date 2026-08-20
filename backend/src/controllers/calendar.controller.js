const CalendarEvent = require("../models/CalendarEvent");
const asyncHandler = require('../utils/asyncHandler');


const createEvent = asyncHandler(async (req, res) => {
    const event = await CalendarEvent.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, data: event, message: "Event created" });
})

const getEvents = asyncHandler(async (req, res) => {
    const { batchId } = req.query;
    const filter = batchId ? { batch: batchId } : {};
    const events = await CalendarEvent.find(filter).sort({ date: 1 });
    res
      .status(200)
      .json({ success: true, data: events, message: "Events fetched" });
})

module.exports = { createEvent, getEvents };
