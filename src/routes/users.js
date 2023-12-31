const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  verifyUser,
} = require("../controllers/users");
const { User } = require("../models/User");

const usersRouter = require("express").Router();

const { advancedResults } = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

usersRouter.use(protect);
usersRouter.use(authorize("admin"));

usersRouter.route("/").get(advancedResults(User), getUsers).post(createUser);
usersRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
usersRouter.get("/verify/:id", verifyUser);

module.exports = usersRouter;
