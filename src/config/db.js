const mongoose = require("mongoose");
const { config } = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo_uri);
    console.log(`Mongodb connected ${conn.connection.host}`.cyan);
  } catch (error) {
    console.error(`Error connecting to Mongodb: ${error}`.red);
  }
};

module.exports = connectDB;
