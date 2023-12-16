const {
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  createGroup,
} = require("../controllers/groups");
const { Group } = require("../models/Group");

const groupRouter = require("express").Router();

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Routes
const taskRouter = require("./tasks");

groupRouter.use("/:id/:lessonId/tasks", taskRouter);

groupRouter.use(protect);
groupRouter.use(authorize("admin"));

groupRouter.route("/").get(advancedResults(Group), getGroups).post(createGroup);
groupRouter.route("/:id").get(getGroup).put(updateGroup).delete(deleteGroup);

module.exports = groupRouter;
