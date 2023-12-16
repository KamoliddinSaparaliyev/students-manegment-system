const Joi = require("joi");
const { idValid } = require("./schema");

const postGradeSchema = {
  body: Joi.object({
    description: Joi.string().required().max(1000),
    grade: Joi.number().required().max(5).min(1),
  }),
  ...idValid,
};

const showGradeSchema = {
  ...idValid,
};

const updateGradeSchema = {
  ...idValid,
  body: Joi.object({
    description: Joi.string().max(1000),
    grade: Joi.number().max(5).min(1),
  }),
};

const deleteGradeSchema = {
  ...idValid,
};

module.exports = {
  postGradeSchema,
  showGradeSchema,
  updateGradeSchema,
  deleteGradeSchema,
};
