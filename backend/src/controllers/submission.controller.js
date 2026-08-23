const { uploadToCloudinary } = require("../services/upload.service");
const Submission = require("../models/Submission");
const {
  validateScore,
  determineGradeLabel,
} = require("../services/grading.service");
const { createNotification } = require("../services/notification.service");
const {
  checkTopScorer,
  checkFastSubmitter,
} = require("../services/badge.service");
const asyncHandler = require("../utils/asyncHandler");

const createSubmission = asyncHandler(async (req, res) => {
  const { assignment, githubUrl, liveDemoUrl, notes } = req.body;

  const existingSubmission = await Submission.findOne({
    assignment,
    student: req.user.id,
  });

  if (existingSubmission) {
    return res.status(409).json({
      success: false,
      data: existingSubmission,
      message: "You have already submitted this assignment.",
    });
  }

  const attachments = [];

  if (req.files?.length) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file);

      attachments.push({
        url: result.secure_url,
        filename: file.originalname,
        fileType: file.mimetype,
        size: file.size,
      });
    }
  }

  const submission = await Submission.create({
    assignment,
    student: req.user.id,
    githubUrl,
    liveDemoUrl,
    notes,
    attachments,
  });

  res.status(201).json({
    success: true,
    data: submission,
    message: "Assignment submitted successfully.",
  });
});
const updateSubmission = asyncHandler(async (req, res) => {
  const { githubUrl, liveDemoUrl, notes } = req.body;

  const submission = await Submission.findOne({
    _id: req.params.id,
    student: req.user.id,
  }).populate("assignment");

  if (!submission) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Submission not found",
    });
  }

  // Once graded, the submission is locked.
  if (submission.status === "Graded") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Graded submissions cannot be edited.",
    });
  }

  // Update text fields
  if (githubUrl !== undefined) {
    submission.githubUrl = githubUrl;
  }

  if (liveDemoUrl !== undefined) {
    submission.liveDemoUrl = liveDemoUrl;
  }

  if (notes !== undefined) {
    submission.notes = notes;
  }

  // Replace attachments only if new files were uploaded.
  if (req.files?.length) {
    const attachments = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file);

      attachments.push({
        url: result.secure_url,
        filename: file.originalname,
        fileType: file.mimetype,
        size: file.size,
      });
    }

    submission.attachments = attachments;
  }

  // Keep the submission as submitted after editing.
  // If it was "Resubmission Requested", editing it means
  // the student is submitting the corrected version again.
  submission.status = "Submitted";
  submission.submittedAt = new Date();

  // Clear old grading data if necessary.
  submission.score = undefined;
  submission.feedback = undefined;
  submission.gradedAt = undefined;

  await submission.save();

  res.status(200).json({
    success: true,
    data: submission,
    message: "Submission updated successfully.",
  });
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const { score, feedback, status } = req.body;

  const submission = await Submission.findById(req.params.id).populate(
    "assignment",
  );

  if (!submission) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Submission not found",
    });
  }

  if (status === "Graded") {
    validateScore(score, submission.assignment.maxScore);
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.status = status;
  submission.gradedAt = new Date();

  await submission.save();

  await createNotification({
    userId: submission.student,
    type:
      status === "Resubmission Requested"
        ? "DeadlineApproaching"
        : "GradePosted",
    message:
      status === "Graded"
        ? `Your submission for "${submission.assignment.title}" scored ${score}/${submission.assignment.maxScore} (${determineGradeLabel(
            score,
            submission.assignment.maxScore,
          )}).`
        : `Resubmission requested for "${submission.assignment.title}": ${feedback}`,
    relatedId: submission._id,
  });

  if (status === "Graded") {
    await checkTopScorer(submission.student, submission);
    await checkFastSubmitter(submission.student, submission);
  }

  res.status(200).json({
    success: true,
    data: submission,
    message: "Submission graded",
  });
});

const getSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId, studentId } = req.query;

  const filter = {};

  if (assignmentId) filter.assignment = assignmentId;

  if (req.user.role === "student") {
    // Students can only ever see their own submissions. Ignore/override
    // any studentId query param to prevent viewing another student's
    // submissions.
    filter.student = req.user.id;
  } else if (studentId) {
    filter.student = studentId;
  }

  const submissions = await Submission.find(filter)
    .populate("student", "name email")
    .populate("assignment", "title maxScore");

  res.status(200).json({
    success: true,
    data: submissions,
    message: "Submissions fetched",
  });
});

module.exports = {
  createSubmission,
  updateSubmission,
  gradeSubmission,
  getSubmissions,
};