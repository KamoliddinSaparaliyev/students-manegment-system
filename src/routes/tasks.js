const {
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  createTask,
} = require("../controllers/tasks");
const { Task } = require("../models/Task");

const taskRouter = require("express").Router({ mergeParams: true });

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

taskRouter.use(protect);

taskRouter
  .route("/")
  .get(
    authorize("student", "teacher", "admin"),
    advancedResults(Task),
    getTasks
  )
  .post(authorize("teacher", "admin"), createTask);
taskRouter
  .route("/:id")
  .get(authorize("teacher", "admin", "student"), getTask)
  .put(authorize("teacher", "admin"), updateTask)
  .delete(authorize("teacher", "admin"), deleteTask);

module.exports = taskRouter;
