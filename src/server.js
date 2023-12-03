const express = require("express");
const colors = require("colors");
const config = require("./config/config");
const connectDB = require("./config/db");

const app = express();

//Connect to Database
connectDB();

const PORT = config.port;

app.listen(
  PORT,
  console.log(
    `Server running ${config.env.inverse} mode on port ${PORT.inverse}`.yellow
  )
);
