const Joi = require("joi");
const httpStatus = require("http-status");

const patientRegistrationSchema = Joi.object({
  user: Joi.string(),
  prefix: Joi.string().allow(""),
  prefixId: Joi.string(),
  patientname: Joi.string().allow(""),
  age: Joi.string().allow(""),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  contact: Joi.string().allow(""),
  address: Joi.string().allow(""),
  country: Joi.string().allow(""),
  state: Joi.string().allow(""),
  city: Joi.string().allow(""),
  pincode: Joi.string().allow(""),
});

const patientIdSchema = Joi.object({
  patientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

function validatePatient(req, res, next) {
  const { error } = patientRegistrationSchema.validate(req.body);
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }
  next();
}

function validatePatientId(req, res, next) {
  const { error } = patientIdSchema.validate(req.params);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid patient ID format",
    });
  }
  next();
}

module.exports = { validatePatient, validatePatientId };
