const Submission = require("../models/Submission");

const createSubmission = async (req, res) => {
  try {
    const { assignment, githubUrl, liveDemoUrl, notes } = req.body;

    const attachments = req.files
      ? req.files.map((f) => ({
          url: f.path,
          filename: f.originalname,
          fileType: f.mimetype,
          size: f.size,
        }))
      : [];

    const submission = await Submission.create({
      assignment,
      student: req.user.id,
      githubUrl,
      liveDemoUrl,
      notes,
      attachments,
    });
    res
      .status(201)
      .json({ success: true, data: submission, message: "Submission created" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};
const gradeSubmission = async (req, res) => {
  try {
    const { score, feedback, status } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { score, feedback, status, gradedAt: new Date() },
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, data: submission, message: "Submission graded" });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.query;
    const filter = {};
    if (assignmentId) filter.assignment = assignmentId;
    if (studentId) filter.student = studentId;

    const submissions = await Submission.find(filter).populate(
      "student",
      "name email",
    );
    res
      .status(200)
      .json({
        success: true,
        data: submissions,
        message: "Submissions fetched",
      });
  } catch (err) {
    res.status(500).json({ success: false, data: null, message: err.message });
  }
};

module.exports = { createSubmission, gradeSubmission, getSubmissions };
