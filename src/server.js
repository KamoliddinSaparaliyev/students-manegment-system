const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { config } = require("./config/config");
const { errorHandler } = require("./middleware/error");

// Routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const courseRouter = require("./routes/courses");
const groupRouter = require("./routes/groups");
const scienceRouter = require("./routes/sciences");
const lessonRouter = require("./routes/lessons");
const taskRouter = require("./routes/tasks");
const resultRouter = require("./routes/results");

const app = express();

// Connect to Database
connectDB();

// JSON parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Morhan
app.use(morgan("dev"));

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/sciences", scienceRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/results", resultRouter);

// Error handling
app.use(errorHandler);

const PORT = config.port;

app.listen(
  PORT,
  console.log(
    `Server running ${config.env.inverse} mode on port ${PORT.inverse}`.yellow
  )
);
