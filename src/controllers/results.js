const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { Result } = require("../models/Result");
const { findDocumentById } = require("../utils/findDocumentById");
const { Task } = require("../models/Task");
const { deleteFiles } = require("../utils/deleteFile");
const { isNotAdmin } = require("../middleware/isNotAdmin");
const {
  showResultSchema,
  postResultSchema,
  deleteResultSchema,
  updateResultSchema,
} = require("../schemas/results");

/**
 * @desc Create Result
 * @route POST /api/v1/tasks/:id/results
 * @access Private/Admin
 */
exports.createResult = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body, params: req.params }, postResultSchema, next);

  isNotAdmin(req, res, async () => {
    const task = await findDocumentById(Task, req.params.id);

    if (task.deadline && new Date() > new Date(task.deadline)) {
      return next(
        new ErrorResponse("Cannot create result after the deadline", 400)
      );
    }

    req.body.student = req.user.id;
    req.body.task = req.params.id;

    const files = req.files.map((file) => file.filename);

    req.body.files = files;

    const result = await Result.create(req.body);

    res.status(200).json({ success: true, data: result });
  });
});

/**
 * @desc Get all results
 * @route GEt /api/v1/results
 * @access Private/Admin
 */
exports.getResults = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single result
 * @route GET /api/v1/results/:id
 * @access Private/Admin
 */
exports.getResult = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showResultSchema, next);

  const result = await findDocumentById(Result, req.params.id);

  res.status(200).json({ success: true, data: result });
});

/**
 * @desc Update result
 * @route PUT /api/v1/results/:id
 * @access Private/Admin
 */
exports.updateResult = asyncHandler(async (req, res, next) => {
  httpValidator(
    { params: req.params, body: req.body },
    updateResultSchema,
    next
  );

  const result = await findDocumentById(Result, req.params.id);

  // Check if the result is associated with the logged-in student
  if (result.student.toString() !== req.user.id) {
    next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    // Check if the task's deadline has passed
    const task = await findDocumentById(Task, result.task); // Assuming there's a 'task' field in your Result schema

    if (task.deadline && new Date() > new Date(task.deadline)) {
      return next(
        new ErrorResponse("Cannot update result after the deadline", 400)
      );
    }

    // Update files and other properties
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => result.files.push(file.filename));
    }

    Object.assign(result, req.body);

    // Save the updated result
    await result.save();

    res.status(200).json({ success: true, data: result });
  });
});

/**
 * @desc Delete result
 * @route DELETE /api/v1/results/:id
 * @access Private/Admin
 */
exports.deleteResult = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteResultSchema, next);

  // Find the lesson by ID
  const result = await findDocumentById(Result, req.params.id);

  // Check if the user has permission to delete the result
  if (result.student.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    // Check if the task's deadline has passed
    const task = await findDocumentById(Task, result.task); // Assuming there's a 'task' field in your Result schema

    if (task.deadline && new Date() > new Date(task.deadline)) {
      return next(
        new ErrorResponse("Cannot delete result after the deadline", 400)
      );
    }

    // Delete associated files
    await deleteFiles(result.files);

    // Delete the lesson
    await result.deleteOne();

    // Send success response
    res.status(200).json({ success: true, data: {} });
  });
});

/**
 * @desc Delete result
 * @route DELETE /api/v1/results/:id/:filename
 * @access Private/Admin
 */
exports.deleteResultFile = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteResultSchema, next);

  // Find the lesson by ID
  const result = await findDocumentById(Result, req.params.id);

  // Check if the user has permission to delete the result
  if (result.student.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    // Check if the task's deadline has passed
    const task = await findDocumentById(Task, result.task); // Assuming there's a 'task' field in your Result schema

    if (task.deadline && new Date() > new Date(task.deadline)) {
      return next(
        new ErrorResponse("Cannot delete result after the deadline", 400)
      );
    }

    // Delete associated files
    await deleteFiles([req.params.filename]);

    // Send success response
    res.status(200).json({ success: true, data: {} });
  });
});
