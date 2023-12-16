const {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createCourse,
} = require("../controllers/courses");
const { Course } = require("../models/Course");

const courseRouter = require("express").Router();

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

courseRouter.use(protect);
courseRouter.use(authorize("admin"));

courseRouter
  .route("/")
  .get(advancedResults(Course), getCourses)
  .post(createCourse);
courseRouter
  .route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = courseRouter;
