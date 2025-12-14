const mongoose = require("mongoose");
const AppError = require("../utils/appError.ut");
const { MONGODB_URI } = require("./env");
const logger = require("../utils/logger.ut");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("----------Database connected----------");
  } catch (error) {
    throw new AppError(`Err in connecting DB: ${error.message}`, 500);
  }
};

module.exports = { connectDB };
