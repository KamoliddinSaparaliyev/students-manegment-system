const {
  getResults,
  getResult,
  updateResult,
  deleteResult,
  createResult,
} = require("../controllers/results");
const { Result } = require("../models/Result");

const resultRouter = require("express").Router({ mergeParams: true });

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Route
const gradeRouter = require("./grades");

// Re-route into other resource routers
resultRouter.use("/:id/grades", gradeRouter);

resultRouter.use(protect);

resultRouter
  .route("/")
  .get(
    authorize("admin", "teacher", "student"),
    advancedResults(Result),
    getResults
  )
  .post(authorize("student"), createResult);
resultRouter
  .route("/:id")
  .get(authorize("admin", "teacher", "student"), getResult)
  .put(authorize("student"), updateResult)
  .delete(authorize("student"), deleteResult);

module.exports = resultRouter;
