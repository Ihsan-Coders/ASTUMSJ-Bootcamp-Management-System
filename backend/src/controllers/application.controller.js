const mongoose = require('mongoose');
const Application = require('../models/Application');
const User = require('../models/User');
const InterviewQuestion = require('../models/InterviewQuestion');
const Batch = require('../models/Batch');
const { hashPassword } = require('../utils/hashPassword');
const asyncHandler = require('../utils/asyncHandler');
const { createActivationToken } = require('../utils/studentRegistration');
const { sendFinalApprovalEmail } = require('../utils/email');

// Statuses that count as "an application already in progress" for the
// duplicate-email check below. Someone whose earlier application was
// rejected/failed is allowed to re-apply.
const ACTIVE_STATUSES = ['Pending Review', 'Interview', 'Interview Completed'];

// POST /api/applications — public, no auth required.
const submitApplication = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Enforce global registration status.
  const Setting = require('../models/Setting');
  const setting = (await Setting.findOne()) || { registrationOpen: true };
  if (!setting.registrationOpen) {
    return res.status(403).json({ success: false, data: null, message: 'Registration is currently closed' });
  }

  const existing = await Application.findOne({
    email,
    status: { $in: ACTIVE_STATUSES },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      data: null,
      message: 'An application with this email is already in progress',
    });
  }

  // status defaults to 'Pending Review' via the schema; no Student/User
  // account is created here.
  const application = await Application.create(req.body);

  res.status(201).json({
    success: true,
    data: application,
    message: 'Application submitted',
  });
});

// GET /api/applications — admin only.
const getApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const applications = await Application.find(filter)
    .populate('assignedMentor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: applications, message: 'Applications fetched' });
});

// GET /api/applications/:id — admin only.
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate(
    'assignedMentor',
    'name email',
  );

  if (!application) {
    return res.status(404).json({ success: false, data: null, message: 'Application not found' });
  }

  res.status(200).json({ success: true, data: application, message: 'Application fetched' });
});

// PUT /api/applications/:id/approve — admin only.
// Only a "Pending Review" application can be approved.
const approveApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ success: false, data: null, message: 'Application not found' });
  }

  if (application.status !== 'Pending Review') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Cannot approve an application with status "${application.status}"`,
    });
  }

  application.status = 'Interview';
  await application.save();

  res.status(200).json({ success: true, data: application, message: 'Application approved' });
});

// PUT /api/applications/:id/reject — admin only.
// Only valid from "Pending Review". Does NOT delete the record — the
// rejection stays on file as part of the application's lifecycle (unlike
// the legacy pending-user flow in user.controller.js, which deletes).
const rejectApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ success: false, data: null, message: 'Application not found' });
  }

  if (application.status !== 'Pending Review') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Cannot reject an application with status "${application.status}"`,
    });
  }

  application.status = 'Rejected';
  await application.save();

  res.status(200).json({ success: true, data: application, message: 'Application rejected' });
});

// PUT /api/applications/:id/assign-mentor — admin only.
// Application must already be "Interview" (i.e. already approved).
// Assigning a mentor does NOT itself change the status.
const assignMentor = asyncHandler(async (req, res) => {
  const { mentorId } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ success: false, data: null, message: 'Application not found' });
  }

  if (application.status !== 'Interview') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Cannot assign a mentor to an application with status "${application.status}"`,
    });
  }

  // mentorId's format is already checked by the Joi schema, but guard
  // again here in case this controller is ever called some other way.
  if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    return res.status(400).json({ success: false, data: null, message: 'Invalid mentor id' });
  }

  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.role !== 'mentor') {
    return res.status(400).json({ success: false, data: null, message: 'Invalid mentor' });
  }

  application.assignedMentor = mentor._id;
  await application.save();

  res.status(200).json({ success: true, data: application, message: 'Mentor assigned' });
});

// GET /api/applications/assigned/mine — mentor only.
// A mentor only ever sees applicants assigned to them.
const getMyAssignedApplicants = asyncHandler(async (req, res) => {
  const applications = await Application.find({ assignedMentor: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: applications,
    message: 'Assigned applicants fetched',
  });
});

// PUT /api/applications/:id/interview-result — mentor only.
// Mentor identity comes from req.user.id, never from the request body.
// Only the mentor this applicant is assigned to may submit a result, and
// only while the application is in "Interview". This transitions the
// application to "Interview Completed" — it does NOT decide Pass/Fail.
// PUT /api/applications/:id/interview-result — mentor only.
// Mentor identity comes from req.user.id, never from the request body.
// Only the mentor this applicant is assigned to may submit a result, and
// only while the application is in "Interview". This transitions the
// application to "Interview Completed" — it does NOT decide Pass/Fail.
//
// The mentor must score every question currently in the global
// InterviewQuestion list (no partial/extra submissions) plus one overall
// note. Each question's text/maxScore is snapshotted onto the answer so
// later edits/deletions to InterviewQuestion never alter this record.
const submitInterviewResult = asyncHandler(async (req, res) => {
  const { answers, note } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ success: false, data: null, message: 'Application not found' });
  }

  if (!application.assignedMentor || String(application.assignedMentor) !== String(req.user.id)) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'You can only submit results for applicants assigned to you',
    });
  }

  if (application.status !== 'Interview') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Cannot submit an interview result for an application with status "${application.status}"`,
    });
  }

  const currentQuestions = await InterviewQuestion.find();

  if (currentQuestions.length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'No interview questions have been configured yet',
    });
  }

  const questionById = new Map(currentQuestions.map((q) => [String(q._id), q]));
  const submittedIds = answers.map((a) => a.questionId);

  const hasUnknownQuestion = submittedIds.some((id) => !questionById.has(id));
  if (hasUnknownQuestion) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'One or more questions are invalid or no longer exist',
    });
  }

  const missingQuestion = currentQuestions.some(
    (q) => !submittedIds.includes(String(q._id)),
  );
  if (missingQuestion || submittedIds.length !== currentQuestions.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'A score is required for every current interview question',
    });
  }

  const invalidScore = answers.some((a) => {
    const question = questionById.get(a.questionId);
    return a.score > question.maxScore;
  });
  if (invalidScore) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'A score cannot exceed its question\'s max score',
    });
  }

  application.interviewAnswers = answers.map((a) => {
    const question = questionById.get(a.questionId);
    return {
      question: question._id,
      questionText: question.text,
      maxScore: question.maxScore,
      score: a.score,
    };
  });
  application.interviewNote = note;
  application.status = 'Interview Completed';
  await application.save();

  res.status(200).json({
    success: true,
    data: application,
    message: 'Interview result submitted',
  });
});

// PUT /api/applications/:id/final-decision — admin only.
// Only valid from "Interview Completed". The mentor's scored answers/note
// are informational only — it does not automatically decide the outcome,
// and this endpoint is the only place status can become Passed/Failed.
//
// On "pass": creates the actual Student account and places it into
// whichever Batch currently has isAcceptingApplicants=true (set via
// Manage Batches). A random temporary password is generated and returned
// directly in this response — NOT emailed, since services/email.service.js
// is still an empty file with no working email transport. Admin is
// expected to relay it manually until that's wired in. This is an
// intentional interim behavior, not a finished feature.
const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let pwd = '';
  for (let i = 0; i < 12; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
};

const finalDecision = asyncHandler(async (req, res) => {
  const { decision } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ success: false, data: null, message: 'Application not found' });
  }

  if (application.status !== 'Interview Completed') {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Cannot make a final decision for an application with status "${application.status}"`,
    });
  }

  if (decision === 'fail') {
    application.status = 'Failed';
    await application.save();

    return res.status(200).json({
      success: true,
      data: application,
      message: 'Application marked as Failed',
    });
  }

  // decision === 'pass'
  const existingUser = await User.findOne({ email: application.email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      data: null,
      message: 'A user with this email already exists',
    });
  }

  const acceptingBatch = await Batch.findOne({ isAcceptingApplicants: true });
  if (!acceptingBatch) {
    return res.status(400).json({
      success: false,
      data: null,
      message:
        'No batch is currently set as accepting applicants. Set one in Manage Batches first.',
    });
  }

  const activationToken = createActivationToken(process.env.CLIENT_URL || 'http://localhost:5173');
  const placeholderPassword = `${process.env.JWT_SECRET || 'bootcamp'}-${Date.now()}-setlater`;
  const hashedPassword = await hashPassword(placeholderPassword);

  const student = await User.create({
    name: application.name,
    email: application.email,
    password: hashedPassword,
    role: 'student',
    batch: acceptingBatch._id,
    isActive: false,
    applicationStatus: 'approved',
    activationTokenHash: activationToken.hash,
    activationTokenExpires: activationToken.expiresAt,
    activationTokenUsed: false,
  });

  acceptingBatch.students.addToSet(student._id);
  await acceptingBatch.save();

  application.status = 'Passed';
  await application.save();

  try {
    await sendFinalApprovalEmail({
      to: student.email,
      name: student.name,
      activateUrl: activationToken.activationUrl,
    });
  } catch (error) {
    console.error('Failed to send activation email for passed applicant:', error.message);
    student.activationTokenHash = undefined;
    student.activationTokenExpires = undefined;
    student.activationTokenUsed = false;
    await student.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      data: null,
      message: 'Application marked as passed, but the activation email could not be delivered.',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      application,
      student: { name: student.name, email: student.email, batch: acceptingBatch.name },
      message: 'Activation email sent successfully',
    },
    message: 'Application marked as Passed and activation email sent successfully.',
  });
});

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  assignMentor,
  getMyAssignedApplicants,
  submitInterviewResult,
  finalDecision,
};
