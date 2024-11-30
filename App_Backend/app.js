const express = require("express");
const cors = require("cors"); // Import the cors package
const cookieParser = require("cookie-parser");
const DBConnection = require("./configs/database");

const app = express();

// Enable CORS for your local development (React app)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your React frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specific methods
    credentials: true, // Allow cookies if needed
  })
);

// Middleware for JSON parsing
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Connect to the database
DBConnection(); // Call the database connection function

// TESTING
app.get("/pipeline-test", (req, res) => {
  try {
    res.status(200).json({
      message: "Pipeline Working!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Import API routes
const healthCheckRouter = require("./routes/healthCheck");
const authRouter = require("./routes/auth");
const userActionsRouter = require("./routes/userActions");

// Define API routes
app.use("/", healthCheckRouter); // Health check route
app.use("/auth", authRouter); // Authentication-related routes
app.use("/user", userActionsRouter);

// Export the app (do not start the server directly)
module.exports = app;
