const Joi = require("joi");
const { idValid } = require("./schema");

const postResultSchema = {
  body: Joi.object({
    description: Joi.string().required(),
  }),
  ...idValid,
};

const showResultSchema = {
  ...idValid,
};

const updateResultSchema = {
  ...idValid,
  body: Joi.object({
    description: Joi.string(),
  }),
};

const deleteResultSchema = {
  ...idValid,
};

module.exports = {
  postResultSchema,
  showResultSchema,
  updateResultSchema,
  deleteResultSchema,
};
