const { ErrorResponse } = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Create a shallow copy of the error object

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack.red); // Log the modified error for debugging
  }

  error.message = err.message; // Preserve the original error message

  // Customize error messages and status codes based on error types
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found`, 404);
  } else if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field entered", 400);
  } else if (err.name === "ValidationError") {
    let messages;
    if (err.details && err.details.length > 0) {
      messages = Object.values(err.details)
        .map((e) => e.message.replace(/"/g, ""))
        .join(", ");
    } else if (err.errors && err.errors.length > 0) {
      messages = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
    }
    error = new ErrorResponse(messages, 400);
  } else if (err.name === "JsonWebTokenError") {
    error = new ErrorResponse("Invalid token", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
