const mongoose = require("mongoose");

const CONNECTION_URL = process.env.CONNECTION_URL;

const DBConnection = async () => {
  console.log(`Attempting to connect to MongoDB at ${CONNECTION_URL}`);
  try {
    await mongoose.connect(CONNECTION_URL, {
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds before timing out
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    console.error("Full error details:", err);
  }
};

module.exports = DBConnection;
