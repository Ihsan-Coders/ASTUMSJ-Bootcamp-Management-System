const MentorNote = require("../models/MentorNote");

const createNote = async (req, res) => {
  try {
    const note = await MentorNote.create({ ...req.body, mentor: req.user.id });
    res.status(201).json({ success: true, data: note, message: "Note added" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getNotesForStudent = async (req, res) => {
  try {
    // SECURITY: this route must never be reachable by students — enforced in routes below
    const notes = await MentorNote.find({ student: req.params.studentId }).sort(
      { createdAt: -1 },
    );
    res
      .status(200)
      .json({ success: true, data: notes, message: "Notes fetched" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { createNote, getNotesForStudent };
