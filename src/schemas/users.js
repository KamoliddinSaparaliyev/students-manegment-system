const Joi = require("joi");
const { idValid } = require("./schema");

const postUserSchema = {
  body: Joi.object({
    name: Joi.string().required().max(100),
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
    age: Joi.number().required().min(10),
    password: Joi.string().required().min(6),
    phoneNumber: Joi.number().required().max(1000).precision(15),
    role: Joi.string()
      .valid("student", "teacher", "assistance", "customer")
      .default("student"),
    gender: Joi.string().valid("male", "female"),
    address: Joi.string().required(),
  }),
};

const showUserSchema = {
  ...idValid,
};

const verifyUserSchema = {
  ...idValid,
};

const updateUserSchema = {
  ...idValid,
  body: Joi.object({
    name: Joi.string().max(100),
    email: Joi.string()
      .pattern(
        new RegExp(
          /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/
        )
      )

      .messages({
        "string.pattern.base": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),
    phoneNumber: Joi.number().max(999999999999999).precision(15),
    age: Joi.number().min(10),
    password: Joi.string().min(6),
    gender: Joi.string().valid("male", "female"),
    address: Joi.string(),
    role: Joi.string().valid("student", "teacher", "assistance", "customer"),
  }),
};

const deleteUserSchema = {
  ...idValid,
};

module.exports = {
  postUserSchema,
  showUserSchema,
  updateUserSchema,
  deleteUserSchema,
  verifyUserSchema,
};
