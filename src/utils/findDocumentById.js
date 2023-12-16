const { ErrorResponse } = require("./errorResponse");

const findDocumentById = async (Model, id, populateFields = "") => {
  let query = Model.findById(id);

  if (populateFields) {
    query = query.populate(populateFields);
  }

  const document = await query.exec();

  if (!document) {
    const error = new ErrorResponse(`${Model.modelName} not found`, 404);
    throw error;
  }

  return document;
};

module.exports = { findDocumentById };
