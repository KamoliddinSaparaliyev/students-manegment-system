const Joi = require("joi");
const { idValid } = require("./schema");

const postUserSchema = {
  body: Joi.object({
    name: Joi.string().required().max(100),
    username: Joi.string().required().lowercase().min(4).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    phoneNumber: Joi.number().required(),
    bornDate: Joi.date().required(),
    gender: Joi.string().required().valid("male", "female"),
    address: Joi.string().required(),
    role: Joi.string()
      .valid("student", "teacher", "assistance", "customer")
      .default("student"),
    student: Joi.object({
      course: Joi.string().required(),
      group: Joi.string().required(),
      isVerified: Joi.boolean().default(true),
    }).when("role", { is: "student", then: Joi.required() }),
    staff: Joi.object({
      position: Joi.string().required(),
      department: Joi.string().required(),
    }).when("role", { not: "student", then: Joi.required() }),
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
    username: Joi.string().lowercase().min(4).max(20),
    email: Joi.string().email(),
    phoneNumber: Joi.string().max(15),
    bornDate: Joi.date(),
    gender: Joi.string().valid("male", "female"),
    address: Joi.string(),
    role: Joi.string()
      .valid("student", "teacher", "assistance", "customer")
      .default("student"),
    student: Joi.object({
      course: Joi.string(),
      group: Joi.string(),
      isVerified: Joi.boolean().default(false),
    }).when("role", { is: "student", then: Joi.required() }),
    staff: Joi.object({
      position: Joi.string(),
      department: Joi.string(),
    }).when("role", { not: "student", then: Joi.required() }),
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
