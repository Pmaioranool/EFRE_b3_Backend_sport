const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI;

async function connectMongo() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectMongo };
