const mongoose = require('mongoose');
const Application = require('../models/Application');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Statuses that count as "an application already in progress" for the
// duplicate-email check below. Someone whose earlier application was
// rejected/failed is allowed to re-apply.
const ACTIVE_STATUSES = ['Pending Review', 'Interview', 'Interview Completed'];

// POST /api/applications — public, no auth required.
const submitApplication = asyncHandler(async (req, res) => {
  const { email } = req.body;

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
const submitInterviewResult = asyncHandler(async (req, res) => {
  const { score, recommendation } = req.body;

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

  application.interviewScore = score;
  application.mentorRecommendation = recommendation;
  application.status = 'Interview Completed';
  await application.save();

  res.status(200).json({
    success: true,
    data: application,
    message: 'Interview result submitted',
  });
});

// PUT /api/applications/:id/final-decision — admin only.
// Only valid from "Interview Completed". The mentor's recommendation is
// informational only — it does not automatically decide the outcome, and
// this endpoint is the only place status can become Passed/Failed.
//
// Student-account creation and admission emails are intentionally NOT
// implemented here: services/email.service.js is currently an empty file
// with no working email capability, and building one is outside this
// task's scope. This endpoint only performs the state transition.
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

  application.status = decision === 'pass' ? 'Passed' : 'Failed';
  await application.save();

  res.status(200).json({
    success: true,
    data: application,
    message: `Application marked as ${application.status}`,
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