const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const httpValidator = require("../utils/httpValidator");
const {
  postUserSchema,
  showUserSchema,
  updateUserSchema,
  deleteUserSchema,
  verifyUserSchema,
} = require("../schemas/users");

/**
 * @desc Create User
 * @route POST /api/v1/users
 * @access Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body }, postUserSchema);

  const user = await User.create(req.body);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Get all user
 * @route GEt /api/v1/users
 * @access Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single user
 * @route GET /api/v1/users/:id
 * @access Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showUserSchema);

  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Update user
 * @route PUT /api/v1/users/:id
 * @access Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params, body: req.body }, updateUserSchema);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Delete user
 * @route DELETE /api/v1/users/:id
 * @access Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteUserSchema);

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

/**
 * @desc Verify User
 * @route POST /api/v1/auth/verify/:id
 * @access Private
 */
exports.verifyUser = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, verifyUserSchema);
  const { id } = req.params;

  let user = await User.findById(id);

  if (!user) throw new ErrorResponse(`User not found with id of ${id}`, 404);

  user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });

  res.status(200).json({ success: true, data: {} });
});
