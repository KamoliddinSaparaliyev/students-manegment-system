const {
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  createLesson,
} = require("../controllers/lessons");
const { Lesson } = require("../models/Lesson");

const lessonRouter = require("express").Router({ mergeParams: true });

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

lessonRouter.use(protect);

lessonRouter
  .route("/")
  .get(
    authorize("student", "admin", "teacher"),
    advancedResults(Lesson),
    getLessons
  )
  .post(authorize("admin", "teacher"), createLesson);
lessonRouter
  .route("/:id")
  .get(authorize("student", "admin", "teacher"), getLesson)
  .put(authorize("admin", "teacher"), updateLesson)
  .delete(authorize("admin", "teacher"), deleteLesson);

module.exports = lessonRouter;
