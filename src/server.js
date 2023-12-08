const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { config } = require("./config/config");
const { errorHandler } = require("./middleware/error");

//
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const app = express();

//Connect to Database
connectDB();

// JSON parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Morhan
app.use(morgan("dev"));

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

// Error handling
app.use(errorHandler);

const PORT = config.port;

app.listen(
  PORT,
  console.log(
    `Server running ${config.env.inverse} mode on port ${PORT.inverse}`.yellow
  )
);
