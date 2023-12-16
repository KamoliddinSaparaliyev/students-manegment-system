const Joi = require("joi");

const postUserSchema = {
  body: Joi.object({
    name: Joi.string().required().max(100),
    username: Joi.string().required().lowercase().min(4).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    phoneNumber: Joi.string().required().max(15),
    bornDate: Joi.date().required(),
    gender: Joi.string().required().valid("male", "female"),
    address: Joi.string().required(),
    role: Joi.string().valid("student").default("student"),
    student: Joi.object({
      course: Joi.string().required(),
      group: Joi.string().required(),
      isVerified: Joi.boolean().default(false),
    }),
  }),
};

const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().max(100),
    username: Joi.string().lowercase().min(4).max(20),
    email: Joi.string().email(),
    phoneNumber: Joi.string().max(15),
    bornDate: Joi.date(),
    gender: Joi.string().valid("male", "female"),
    address: Joi.string(),
    role: Joi.string().valid("student").default("student"),
    student: Joi.object({
      course: Joi.string(),
      group: Joi.string(),
    }),
  }),
};

const updatePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6),
  }),
};

const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .pattern(
        new RegExp(
          /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/
        )
      )
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),
  }),
};

const resetPasswordSchema = {
  params: Joi.object({
    resettoken: Joi.string().required(),
  }),
};

const loginUserSchema = {
  body: Joi.object({
    email: Joi.string()
      .pattern(
        new RegExp(
          /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/
        )
      )
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),
    password: Joi.string().required().min(6),
  }),
};

module.exports = {
  postUserSchema,
  updateUserSchema,
  updatePasswordSchema,
  loginUserSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
