const mongoose = require("mongoose");
const AppError = require("../utils/appError.ut");
const { MONGODB_URI } = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("----------Database connected----------");
  } catch (error) {
    throw new AppError(`Err in connecting DB: ${error.message}`, 500);
  }
};

module.exports = { connectDB };
