const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in the environment variables.");
  }

  await mongoose.connect(mongoURI);
  console.log("MongoDB connected successfully.");
};

module.exports = connectDB;
