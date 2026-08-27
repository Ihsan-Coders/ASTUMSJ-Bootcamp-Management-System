const Joi = require('joi');

// POST /api/applications — public registration form.
const createApplicationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().lowercase().email().required(),

  academicYear: Joi.string().trim().required(),

  department: Joi.string().trim().required(),

  // No existing SRS/project convention defines allowed gender values —
  // accepted as free text rather than an invented enum.
  gender: Joi.string().trim().required(),

  phoneNumber: Joi.string().trim().required(),

  dailyCommitmentHours: Joi.number().min(5).required().messages({
    'number.min': 'Daily time commitment must be at least 5 hours',
  }),

  motivation: Joi.string().trim().required(),

  codeforcesHandle: Joi.string().trim().allow('', null),
  leetcodeHandle: Joi.string().trim().allow('', null),
  githubUrl: Joi.string().trim().uri().allow('', null),
});

// PUT /api/applications/:id/assign-mentor
const assignMentorSchema = Joi.object({
  mentorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({ 'string.pattern.base': 'Invalid mentor id' }),
});

// PUT /api/applications/:id/interview-result — mentor submits score + recommendation.
// The SRS does not define a scoring scale for interviews (Submission scoring
// is out of assignment.maxScore, which doesn't apply here). A plain 0-100
// range is used as the simplest reasonable default — flagged in the report
// below in case the team wants a different scale.
const interviewResultSchema = Joi.object({
  score: Joi.number().min(0).max(100).required(),
  recommendation: Joi.string().valid('pass', 'fail').required(),
});

// PUT /api/applications/:id/final-decision — admin makes the final call.
const finalDecisionSchema = Joi.object({
  decision: Joi.string().valid('pass', 'fail').required(),
});

module.exports = {
  createApplicationSchema,
  assignMentorSchema,
  interviewResultSchema,
  finalDecisionSchema,
};