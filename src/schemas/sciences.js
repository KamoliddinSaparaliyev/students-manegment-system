const Joi = require("joi");
const { idValid } = require("./schema");

const postScienceSchema = {
  body: Joi.object({
    name: Joi.string().required().min(4).max(20),
    teachers: Joi.array().items(Joi.string()),
  }),
};

const showScienceSchema = {
  ...idValid,
};

const updateScienceSchema = {
  ...idValid,
  body: Joi.object({
    name: Joi.string().min(4).max(20),
    teachers: Joi.array().items(Joi.string()),
  }),
};

const deleteScienceSchema = {
  ...idValid,
};

module.exports = {
  postScienceSchema,
  showScienceSchema,
  updateScienceSchema,
  deleteScienceSchema,
};
