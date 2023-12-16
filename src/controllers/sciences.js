const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { findDocumentById } = require("../utils/findDocumentById");
const { Science } = require("../models/Science");
const { ErrorResponse } = require("../utils/errorResponse");
const {
  showScienceSchema,
  postScienceSchema,
  deleteScienceSchema,
  updateScienceSchema,
} = require("../schemas/sciences");

/**
 * @desc Create science
 * @route POST /api/v1/sciences
 * @access Private/Admin
 */
exports.createScience = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body }, postScienceSchema, next);

  const { teachers } = req.body;

  if (teachers && teachers.length > 0) {
    try {
      await Promise.all(
        teachers.map(async (t) => {
          const teacher = await findDocumentById(User, t);
          if (teacher.role !== "teacher") {
            return next(new ErrorResponse("Only a teacher can be added", 400));
          }
        })
      );
    } catch (error) {
      return next(new ErrorResponse("Teacher not found", 404));
    }
  }

  const science = await Science.create(req.body);

  res.status(200).json({ success: true, data: science });
});

/**
 * @desc Get all sciences
 * @route GEt /api/v1/sciences
 * @access Private/Admin
 */
exports.getSciences = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single science
 * @route GET /api/v1/science/:id
 * @access Private/Admin
 */
exports.getScience = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showScienceSchema, next);

  const science = await findDocumentById(Science, req.params.id);

  res.status(200).json({ success: true, data: science });
});

/**
 * @desc Update science
 * @route PUT /api/v1/sciences/:id
 * @access Private/Admin
 */
exports.updateScience = asyncHandler(async (req, res, next) => {
  httpValidator(
    { params: req.params, body: req.body },
    updateScienceSchema,
    next
  );

  const { teachers, name } = req.body;

  const updatedFields = { name };

  let science = await findDocumentById(Science, req.params.id);

  if (teachers && teachers.length > 0) {
    try {
      await Promise.all(
        teachers.map(async (teacher) => {
          await findDocumentById(User, teacher);
        })
      );

      // Add unique teachers to the existing list
      const uniqueTeachers = teachers.filter(
        (teacher) => !science.teachers.includes(teacher)
      );
      science.teachers.push(...uniqueTeachers);
    } catch (error) {
      return next(new ErrorResponse("Teacher not found", 404));
    }
  }

  // Update science fields
  Object.assign(science, updatedFields);

  await science.save();

  res.status(200).json({ success: true, data: science });
});

/**
 * @desc Delete science
 * @route DELETE /api/v1/sciences/:id
 * @access Private/Admin
 */
exports.deleteScience = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteScienceSchema, next);

  const science = await findDocumentById(Science, req.params.id);

  await science.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
