const {
  getSciences,
  getScience,
  updateScience,
  deleteScience,
  createScience,
} = require("../controllers/sciences");
const { Science } = require("../models/Science");

const scienceRouter = require("express").Router();

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Routes

const lessonRouter = require("./lessons");

// Re-route into other resource routers
scienceRouter.use("/:id/lessons", lessonRouter);

scienceRouter.use(protect);

scienceRouter
  .route("/")
  .get(
    authorize("admin", "teacher", "student"),
    advancedResults(Science),
    getSciences
  )
  .post(authorize("admin", "customer"), createScience);
scienceRouter
  .route("/:id")
  .get(authorize("admin", "teacher", "student"), getScience)
  .put(authorize("admin", "customer"), updateScience)
  .delete(authorize("admin", "customer"), deleteScience);

module.exports = scienceRouter;
