const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { findDocumentById } = require("../utils/findDocumentById");
const { Grade } = require("../models/Grade");
const { Result } = require("../models/Result");
const { isNotAdmin } = require("../middleware/isNotAdmin");
const {
  showGradeSchema,
  postGradeSchema,
  deleteGradeSchema,
  updateGradeSchema,
} = require("../schemas/grades");

/**
 * @desc Create Grade
 * @route POST /api/v1/results/:id/grades
 * @access Private [Teacher]
 */
exports.createGrade = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body, params: req.params }, postGradeSchema, next);

  isNotAdmin(req, res, async () => {
    const result = await findDocumentById(Result, req.params.id);

    req.body.student = result.student;
    req.body.teacher = req.user.id;
    req.body.result = req.params.id;

    const grade = await Grade.create(req.body);

    res.status(200).json({ success: true, data: grade });
  });
});

/**
 * @desc Get all grades
 * @route GEt /api/v1/grades
 * @access Private [Admin,Teacher]
 */
exports.getGrades = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single grade
 * @route GET /api/v1/grades/:id
 * @access Private [Admin, Teacher]
 */
exports.getGrade = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showGradeSchema, next);

  const grade = await findDocumentById(Grade, req.params.id);

  res.status(200).json({ success: true, data: grade });
});

/**
 * @desc Update grade
 * @route PUT /api/v1/grades/:id
 * @access Private Teacher
 */
exports.updateGrade = asyncHandler(async (req, res, next) => {
  httpValidator(
    { params: req.params, body: req.body },
    updateGradeSchema,
    next
  );

  const grade = await findDocumentById(Grade, req.params.id);

  if (grade.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    Object.assign(grade, req.body);

    await grade.save();

    res.status(200).json({ success: true, data: grade });
  });
});

/**
 * @desc Delete grade
 * @route DELETE /api/v1/grades/:id
 * @access Private Teacher
 */
exports.deleteGrade = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteGradeSchema, next);

  // Find the grade by ID
  const grade = await findDocumentById(Grade, req.params.id);

  // Check if the user has permission to delete the grade
  if (grade.teacher.toString() !== req.user.id) {
    return next(new ErrorResponse("Unauthenticated access", 403));
  }

  isNotAdmin(req, res, async () => {
    // Delete the grade
    await grade.deleteOne();

    // Send success response
    res.status(200).json({ success: true, data: {} });
  });
});
