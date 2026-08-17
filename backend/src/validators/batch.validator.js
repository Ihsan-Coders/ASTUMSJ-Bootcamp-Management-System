const Joi = require('joi');

const createBatchSchema = Joi.object({
  name: Joi.string().min(3).trim().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  registrationStart: Joi.date().required(),
  registrationEnd: Joi.date().greater(Joi.ref('registrationStart')).required(),
  isActive: Joi.boolean().default(true),
});
const updateBatchSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    startDate: Joi.date(),
    endDate: Joi.date(),
    registrationStart: Joi.date(),
    registrationEnd: Joi.date(),
    isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createBatchSchema,
  updateBatchSchema,
};