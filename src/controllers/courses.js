const asyncHandler = require("express-async-handler");
const httpValidator = require("../utils/httpValidator");
const { Course } = require("../models/Course");
const {
  showCourseSchema,
  postCourseSchema,
  deleteCourseSchema,
  updateCourseSchema,
} = require("../schemas/courses");
const { findDocumentById } = require("../utils/findDocumentById");

/**
 * @desc Create Course
 * @route POST /api/v1/couses
 * @access Private/Admin
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  httpValidator({ body: req.body }, postCourseSchema, next);

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Get all courses
 * @route GEt /api/v1/couses
 * @access Private/Admin
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get single course
 * @route GET /api/v1/couses/:id
 * @access Private/Admin
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, showCourseSchema, next);

  const course = await findDocumentById(Course, req.params.id, {
    path: "students",
    select: "name email",
  });

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Update course
 * @route PUT /api/v1/couses/:id
 * @access Private/Admin
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params, body: req.body }, updateCourseSchema, next);

  await findDocumentById(Course, req.params.id);

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc Delete course
 * @route DELETE /api/v1/couses/:id
 * @access Private/Admin
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  httpValidator({ params: req.params }, deleteCourseSchema, next);

  await findDocumentById(Course, req.params.id);

  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
