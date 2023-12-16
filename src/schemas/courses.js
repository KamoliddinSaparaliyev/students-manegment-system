const Joi = require("joi");
const { idValid } = require("./schema");

const postCourseSchema = {
  body: Joi.object({
    name: Joi.string().required().max(200),
    courseNumber: Joi.number().required(),
  }),
};

const showCourseSchema = {
  ...idValid,
};

const updateCourseSchema = {
  ...idValid,
  body: Joi.object({
    name: Joi.string().max(200),
    courseNumber: Joi.number().max(10),
  }),
};

const deleteCourseSchema = {
  ...idValid,
};

module.exports = {
  postCourseSchema,
  showCourseSchema,
  updateCourseSchema,
  deleteCourseSchema,
};
