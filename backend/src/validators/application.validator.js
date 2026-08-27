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

// PUT /api/applications/:id/interview-result — mentor submits a score per
// question (validated against the current question list in the
// controller, since each question's actual maxScore is only known there)
// plus one overall note explaining the scores.
const interviewResultSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({ 'string.pattern.base': 'Invalid question id' }),
        score: Joi.number().min(0).required(),
      }),
    )
    .min(1)
    .required(),
  note: Joi.string().trim().required(),
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
