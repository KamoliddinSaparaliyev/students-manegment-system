const Joi = require("joi");
const { idValid } = require("./schema");

const postLessonSchema = {
  body: Joi.object({
    name: Joi.string().required().max(500),
    description: Joi.string().required(),
    duration: Joi.number().required(),
  }),
  ...idValid,
};

const showLessonSchema = {
  ...idValid,
};

const updateLessonSchema = {
  ...idValid,
  body: Joi.object({
    name: Joi.string().max(500),
    description: Joi.string(),
    duration: Joi.number(),
  }),
};

const deleteLessonSchema = {
  ...idValid,
};

module.exports = {
  postLessonSchema,
  showLessonSchema,
  updateLessonSchema,
  deleteLessonSchema,
};
