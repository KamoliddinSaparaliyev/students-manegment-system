const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { findDocumentById } = require("../utils/findDocumentById");
const { ErrorResponse } = require("../utils/errorResponse");
const { Lesson } = require("../models/Lesson");
const { Science } = require("../models/Science");
const { isNotAdmin } = require("../middleware/isNotAdmin");
const { deleteFiles } = require("../utils/deleteFile");
const {
  showLessonSchema,
  postLessonSchema,
  deleteLessonSchema,
  updateLessonSchema,
} = require("../schemas/lessons");

/**
 * @desc Create lesson
 * @route POST /api/v1/sciences/:id/lessons
 * @access Private/Admin
 */
exports.createLesson = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body, params: req.params }, postLessonSchema, next);

  isNotAdmin(req, res, async () => {
    await findDocumentById(Science, req.params.id);

    req.body.teacher = req.user.id;
    req.body.science = req.params.id;

    const files = req.files.map((file) => file.filename);

    req.body.files = files;

    const lesson = await Lesson.create(req.body);

    res.status(200).json({ success: true, data: lesson });
  });
});

/**
 * @desc Get all lessons
 * @route GEt /api/v1/lessons
 * @access Private/Admin
 */
exports.getLessons = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single lesson
 * @route GET /api/v1/lesson/:id
 * @access Private/Admin
 */
exports.getLesson = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showLessonSchema, next);

  const lesson = await findDocumentById(Lesson, req.params.id);

  res.status(200).json({ success: true, data: lesson });
});

/**
 * @desc Update lesson
 * @route PUT /api/v1/lessons/:id
 * @access Private/Admin
 */
exports.updateLesson = asyncHandler(async (req, res, next) => {
  httpValidator(
    { params: req.params, body: req.body },
    updateLessonSchema,
    next
  );

  const lesson = await findDocumentById(Lesson, req.params.id);

  if (lesson.teacher.toString() !== req.user.id) {
    throw new ErrorResponse("Unauthenticated access", 403);
  }

  isNotAdmin(req, res, async () => {
    if (req.files && req.files.length > 0) {
      req.files.map((file) => lesson.files.push(file.filename));
    }

    Object.assign(lesson, req.body);

    await lesson.save();

    res.status(200).json({ success: true, data: lesson });
  });
});

/**
 * @desc Delete lesson
 * @route DELETE /api/v1/lessons/:id
 * @access Private/Admin
 */
exports.deleteLesson = asyncHandler(async (req, res, next) => {
  // Validate request parameters
  httpValidator({ params: req.params }, deleteLessonSchema, next);

  // Find the lesson by ID
  const lesson = await findDocumentById(Lesson, req.params.id);

  // Check if the user has permission to delete the lesson
  if (lesson.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    // Delete associated files
    await deleteFiles(lesson.files);

    // Delete the lesson
    await lesson.deleteOne();
  });

  // Send success response
  res.status(200).json({ success: true, data: {} });
});
