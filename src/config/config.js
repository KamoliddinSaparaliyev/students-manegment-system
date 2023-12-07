const path = require("path");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "config.env");

dotenv.config({ path: envPath });

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  mongo_uri: process.env.MONGO_URI,
  geocoder: {
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    cookie_expire: process.env.JWT_COOKIE_EXPIRE,
  },
  email: process.env.EMAIL,
  pass: process.env.PASSWORD,
  service: process.env.SERVICE,
};

module.exports = { config };
