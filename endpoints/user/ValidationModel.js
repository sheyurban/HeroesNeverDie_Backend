const Joi = require("joi");
const mongoose = require("mongoose")

const validationSchema = {
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required().lowercase().uppercase(),
};

var userValidator = mongoose.model("Validation", validationSchema);
module.exports = userValidator;
