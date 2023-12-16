const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { Task } = require("../models/Task");
const { findDocumentById } = require("../utils/findDocumentById");
const { Group } = require("../models/Group");
const { deleteFiles } = require("../utils/deleteFile");
const { isNotAdmin } = require("../middleware/isNotAdmin");
const {
  showTaskSchema,
  postTaskSchema,
  deleteTaskSchema,
  updateTaskSchema,
} = require("../schemas/tasks");

/**
 * @desc Create Task
 * @route POST /api/v1/groups/:id/:lessonId/tasks
 * @access Private/Admin
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body, params: req.params }, postTaskSchema, next);

  isNotAdmin(req, res, async () => {
    await findDocumentById(Lesson, req.params.lessonId);

    await findDocumentById(Group, req.params.id);

    req.body.teacher = req.user.id;
    req.body.lesson = req.params.lessonId;
    req.body.group = req.params.id;

    const files = req.files.map((file) => file.filename);

    req.body.files = files;

    const task = await Task.create(req.body);

    res.status(200).json({ success: true, data: task });
  });
});

/**
 * @desc Get all tasks
 * @route GEt /api/v1/tasks
 * @access Private/Admin
 */
exports.getTasks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single task
 * @route GET /api/v1/tasks/:id
 * @access Private/Admin
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showTaskSchema, next);

  const task = await findDocumentById(Task, req.params.id);

  res.status(200).json({ success: true, data: task });
});

/**
 * @desc Update task
 * @route PUT /api/v1/tasks/:id
 * @access Private/Admin
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params, body: req.body }, updateTaskSchema, next);

  const task = await findDocumentById(Task, req.params.id);

  if (task.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    if (req.files.length > 0 && req.files) {
      req.files.map((file) => task.files.push(file.filename));
    }

    Object.assign(task, req.body);

    await task.save();

    res.status(200).json({ success: true, data: task });
  });
});

/**
 * @desc Delete task
 * @route DELETE /api/v1/tasks/:id
 * @access Private/Admin
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteTaskSchema, next);

  // Find the lesson by ID
  const task = await findDocumentById(Task, req.params.id);

  // Check if the user has permission to delete the task
  if (task.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    // Delete associated files
    await deleteFiles(task.files);

    // Delete the lesson
    await task.deleteOne();

    // Send success response
    res.status(200).json({ success: true, data: {} });
  });
});
