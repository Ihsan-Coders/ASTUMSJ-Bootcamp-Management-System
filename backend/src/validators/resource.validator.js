const Joi = require("joi");

// `url` is required for Link/Video resources. For "Document" resources the
// URL instead comes from the uploaded file (handled in the controller after
// the Cloudinary upload), so it is optional at this validation stage.
const createResourceSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().allow("").max(1000).default(""),
  type: Joi.string().valid("Link", "Document", "Video").required(),
  topic: Joi.string().trim().min(1).max(100).required(),
  url: Joi.string().trim().uri().when("type", {
    is: "Document",
    then: Joi.optional().allow(""),
    otherwise: Joi.required(),
  }),
  batch: Joi.string().hex().length(24).allow("", null),
});

module.exports = { createResourceSchema };
