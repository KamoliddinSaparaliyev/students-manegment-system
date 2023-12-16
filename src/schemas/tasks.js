const Joi = require("joi");
const { idValid } = require("./schema");

const postTaskSchema = {
  body: Joi.object({
    deadline: Joi.date().required(),
    description: Joi.string().required().max(1000),
  }),
  params: {
    lessonId: Joi.string().required(),
    id: Joi.string().required(),
  },
};

const showTaskSchema = {
  ...idValid,
};

const updateTaskSchema = {
  ...idValid,
  body: Joi.object({
    deadline: Joi.date(),
    description: Joi.string().max(1000),
  }),
};

const deleteTaskSchema = {
  ...idValid,
};

module.exports = {
  postTaskSchema,
  showTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
};
