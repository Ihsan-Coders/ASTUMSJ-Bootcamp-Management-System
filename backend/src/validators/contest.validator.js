const Joi = require("joi");

const createContestSchema = Joi.object({
  name: Joi.string().min(3).required(),
  codeforcesContestId: Joi.number().integer().positive().required(),
  batch: Joi.string().required(),
  startTime: Joi.date().required(),
  durationMinutes: Joi.number().integer().positive().required(),
  problems: Joi.array()
    .items(
      Joi.object({
        index: Joi.string().required(),
        name: Joi.string().allow("").optional(),
        points: Joi.number().optional(),
      }),
    )
    .optional(),
});

module.exports = { createContestSchema };
