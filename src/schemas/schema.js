const Joi = require("joi");

const idValid = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = { idValid };
