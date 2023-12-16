const Joi = require("joi");
const { ErrorResponse } = require("./errorResponse");

/**
 * @param {{ body, params, query }} param0
 * @param {{ body: Joi.Schema, params: Joi.Schema, query: Joi.Schema }} schema
 * @returns
 */
const httpValidator = ({ body, params, query }, schema, next) => {
  // Destructure schema objects
  const { body: bodySchema, params: paramsSchema, query: querySchema } = schema;

  // Validate request body
  if (body) {
    const { error } = bodySchema.validate(body);
    if (error) return next(error);
  }

  // Validate request params
  if (params) {
    const { error } = paramsSchema.validate(params);
    if (error) return next(error);
  }

  // Validate query parameters
  if (query) {
    const { error } = querySchema.validate(query);
    if (error) return next(error);
  }
};

module.exports = httpValidator;
