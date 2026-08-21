const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const {validateScore,determineGradeLabel,} = require("../services/grading.service");
const { createNotification } = require("../services/notification.service");
const {
  checkTopScorer,
  checkFastSubmitter,
} = require("../services/badge.service");
const asyncHandler = require('../utils/asyncHandler');

const createSubmission = asyncHandler(async (req, res) => {
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
})

const gradeSubmission = asyncHandler(async (req, res) => {
    const { score, feedback, status } = req.body;
    const submission = await Submission.findById(req.params.id).populate(
      "assignment",
    );
    if (!submission)
      return res
        .status(404)
        .json({ success: false, data: null, message: "Submission not found" });

    if (status === "Graded") {
      validateScore(score, submission.assignment.maxScore);
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = status;
    submission.gradedAt = new Date();
    await submission.save();

    // Notify the student — this is the trigger point M4 flagged on Day 3
    await createNotification({
      userId: submission.student,
      type:
        status === "Resubmission Requested"
          ? "DeadlineApproaching"
          : "GradePosted",
      message:
        status === "Graded"
          ? `Your submission for "${submission.assignment.title}" scored ${score}/${submission.assignment.maxScore} (${determineGradeLabel(score, submission.assignment.maxScore)}).`
          : `Resubmission requested for "${submission.assignment.title}": ${feedback}`,
      relatedId: submission._id,
    });
    if (status === "Graded") {
      await checkTopScorer(submission.student, submission);
      await checkFastSubmitter(submission.student, submission);
    }

    res
      .status(200)
      .json({ success: true, data: submission, message: "Submission graded" });
})

const getSubmissions = asyncHandler(async (req, res) => {
    const { assignmentId, studentId } = req.query;
    const filter = {};
    if (assignmentId) filter.assignment = assignmentId;
    if (studentId) filter.student = studentId;

    const submissions = await Submission.find(filter).populate(
      "student",
      "name email",
    );
    res.status(200).json({
      success: true,
      data: submissions,
      message: "Submissions fetched",
    });

})

module.exports = { createSubmission, gradeSubmission, getSubmissions };
