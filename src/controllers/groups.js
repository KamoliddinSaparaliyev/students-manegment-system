const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { findDocumentById } = require("../utils/findDocumentById");
const { Group } = require("../models/Group");
const {
  showGroupSchema,
  postGroupSchema,
  deleteGroupSchema,
  updateGroupSchema,
} = require("../schemas/groups");

/**
 * @desc Create Group
 * @route POST /api/v1/groups
 * @access Private/Admin
 */
exports.createGroup = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body }, postGroupSchema, next);

  const group = await Group.create(req.body);

  res.status(200).json({ success: true, data: group });
});

/**
 * @desc Get all groups
 * @route GEt /api/v1/groups
 * @access Private/Admin
 */
exports.getGroups = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single group
 * @route GET /api/v1/groups/:id
 * @access Private/Admin
 */
exports.getGroup = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showGroupSchema, next);

  const group = await findDocumentById(Group, req.params.id, {
    path: "students",
    select: "name email",
  });

  res.status(200).json({ success: true, data: group });
});

/**
 * @desc Update group
 * @route PUT /api/v1/groups/:id
 * @access Private/Admin
 */
exports.updateGroup = asyncHandler(async (req, res, next) => {
  httpValidator(
    { params: req.params, body: req.body },
    updateGroupSchema,
    next
  );

  await findDocumentById(Group, req.params.id);

  const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: group });
});

/**
 * @desc Delete group
 * @route DELETE /api/v1/groups/:id
 * @access Private/Admin
 */
exports.deleteGroup = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteGroupSchema, next);

  await findDocumentById(Group, req.params.id);

  await Group.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
