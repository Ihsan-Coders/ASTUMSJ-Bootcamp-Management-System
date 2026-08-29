const Joi = require('joi');

const AUDIENCES = ['All', 'Students', 'Mentors', 'SpecificBatch'];

const createAnnouncementSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  content: Joi.string().trim().min(1).max(5000).required(),
  targetAudience: Joi.string().valid(...AUDIENCES).required(),
  batch: Joi.string().hex().length(24).when('targetAudience', {
    is: 'SpecificBatch',
    then: Joi.required(),
    otherwise: Joi.optional().allow(null, ''),
  }),
  publishDate: Joi.date().optional(),
  isSession: Joi.boolean().optional(),
  sessionDate: Joi.date().optional().allow(null, ''),
});

const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  content: Joi.string().trim().min(1).max(5000),
  targetAudience: Joi.string().valid(...AUDIENCES),
  batch: Joi.string().hex().length(24).allow(null, ''),
  publishDate: Joi.date(),
  isSession: Joi.boolean().optional(),
  sessionDate: Joi.date().optional().allow(null, ''),
}).min(1);


module.exports = {
  createAnnouncementSchema,
  updateAnnouncementSchema,
};
