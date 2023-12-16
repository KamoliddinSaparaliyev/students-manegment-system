const Joi = require("joi");
const { idValid } = require("./schema");

const postGroupSchema = {
  body: Joi.object({
    name: Joi.string().required().min(4).max(20),
    course: Joi.string().required(),
  }),
};

const showGroupSchema = {
  ...idValid,
};

const updateGroupSchema = {
  ...idValid,
  body: Joi.object({
    name: Joi.string().min(4).max(20),
  }),
};

const deleteGroupSchema = {
  ...idValid,
};

module.exports = {
  postGroupSchema,
  showGroupSchema,
  updateGroupSchema,
  deleteGroupSchema,
};
