const Joi = require("joi");

const createDSAProblemSchema = Joi.object({
  problemLink: Joi.string().uri().required(),

  platform: Joi.string()
    .valid("Codeforces", "LeetCode")
    .required(),

  timeTakenMinutes: Joi.number()
    .integer()
    .min(1)
    .max(1440)
    .required(),

  solutionUrl: Joi.string().uri().required(),
});

module.exports = {
  createDSAProblemSchema,
};
