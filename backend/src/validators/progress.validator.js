const Joi = require("joi");

const updateProgressSchema = Joi.object({
  student: Joi.string().required(),

  batch: Joi.string().required(),

  topic: Joi.string().trim().required(),

  progress: Joi.number().min(0).max(100).required(),

  status: Joi.string()
    .valid(
      "Not Started",
      "In Progress",
      "Completed",
      "Needs Improvement"
    )
    .required(),

  notes: Joi.string().allow("").optional(),
});

module.exports = {
  updateProgressSchema,
};