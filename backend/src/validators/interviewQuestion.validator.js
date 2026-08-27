const Joi = require('joi');

const createInterviewQuestionSchema = Joi.object({
  text: Joi.string().trim().min(3).required(),
  maxScore: Joi.number().min(1).required(),
});

const updateInterviewQuestionSchema = Joi.object({
  text: Joi.string().trim().min(3),
  maxScore: Joi.number().min(1),
}).min(1);

module.exports = {
  createInterviewQuestionSchema,
  updateInterviewQuestionSchema,
};
