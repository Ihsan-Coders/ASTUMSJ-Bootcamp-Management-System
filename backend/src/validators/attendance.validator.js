const Joi = require('joi');


// Validate attendance data
const markAttendanceSchema = Joi.object({
  student: Joi.string().required(),
  batch: Joi.string().required(),
  date: Joi.date().required(),
  status: Joi.string()
    .valid(
      'Present',
      'Absent',
      'Late',
      'Excused'
    )
    .required()
});


module.exports = {
  markAttendanceSchema
};