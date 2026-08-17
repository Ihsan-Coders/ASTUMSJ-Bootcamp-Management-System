const Joi = require('joi');


// Validate progress update data
const updateProgressSchema = Joi.object({
  student: Joi.string().required(),
  batch: Joi.string().required(),
  topic: Joi.string().required(),
  status: Joi.string()
    .valid(
      'Not Started',
      'In Progress',
      'Completed',
      'Needs Improvement'
    )
    .required(),
  notes: Joi.string().allow('').optional()
});


module.exports = {
  updateProgressSchema
};