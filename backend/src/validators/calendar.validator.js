const Joi = require('joi');

// Manual event creation is limited to "Session" and "Custom" types.
// "AssignmentDeadline" events are created/updated automatically by
// calendar.service.js whenever an assignment deadline is set/changed.
const createEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().allow('').max(2000),
  type: Joi.string().valid('Session', 'Custom').required(),
  date: Joi.date().required(),
  batch: Joi.string().hex().length(24).allow(null, ''),
});

const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().allow('').max(2000),
  type: Joi.string().valid('Session', 'Custom'),
  date: Joi.date(),
  batch: Joi.string().hex().length(24).allow(null, ''),
}).min(1);

module.exports = {
  createEventSchema,
  updateEventSchema,
};
