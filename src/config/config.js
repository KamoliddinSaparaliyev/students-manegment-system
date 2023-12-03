const path = require("path");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "config.env");

dotenv.config({ path: envPath });

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  mongo_uri: process.env.MONGO_URI,
};

module.exports = config;
