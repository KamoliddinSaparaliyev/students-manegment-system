const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

const authRouter = require("express").Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/me", protect, getMe);
authRouter.post("/forgetpassword", forgetPassword);
authRouter.put("/resetpassword/:resettoken", resetPassword);
authRouter.put("/updatedetails", protect, updateDetails);
authRouter.put("/updatepassword", protect, updatePassword);

module.exports = authRouter;
