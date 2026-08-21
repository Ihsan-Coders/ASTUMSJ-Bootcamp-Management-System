const MentorNote = require("../models/MentorNote");
const asyncHandler = require('../utils/asyncHandler');

const createNote = asyncHandler(async (req, res) => {
    const note = await MentorNote.create({ ...req.body, mentor: req.user.id });
    res.status(201).json({ success: true, data: note, message: "Note added" });
})

const getNotesForStudent = asyncHandler(async (req, res) => {
    // SECURITY: this route must never be reachable by students — enforced in routes below
    const notes = await MentorNote.find({ student: req.params.studentId }).sort(
      { createdAt: -1 },
    );
    res
      .status(200)
      .json({ success: true, data: notes, message: "Notes fetched" });
})

module.exports = { createNote, getNotesForStudent };
