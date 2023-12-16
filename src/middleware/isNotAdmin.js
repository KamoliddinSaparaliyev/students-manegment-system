const { ErrorResponse } = require("../utils/errorResponse");

// Middleware to check if user is an admin
const isNotAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }
  next();
};

module.exports = { isNotAdmin };
