const {
  getGrades,
  getGrade,
  updateGrade,
  deleteGrade,
  createGrade,
} = require("../controllers/grades");
const { Grade } = require("../models/Grade");

const gradeRouter = require("express").Router();

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

gradeRouter.use(protect);

gradeRouter
  .route("/")
  .get(
    authorize("admin", "teacher", "student"),
    advancedResults(Grade),
    getGrades
  )
  .post(authorize("admin", "teacher"), createGrade);
gradeRouter
  .route("/:id")
  .get(authorize("admin", "teacher", "student"), getGrade)
  .put(authorize("admin", "teacher"), updateGrade)
  .delete(authorize("admin", "teacher"), deleteGrade);

module.exports = gradeRouter;
