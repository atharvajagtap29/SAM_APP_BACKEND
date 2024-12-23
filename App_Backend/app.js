const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const DBConnection = require("./configs/database");

const app = express();

// Enable CORS for your local development (React app)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your React frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specified methods
    credentials: true, // Allow cookies back that frontend is sending, for authentication
  })
);

// Middleware for JSON parsing
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

app.get("/test-pipeline", async (req, res) => {
  try {
    res.status(200).json({
      message: "Test pipeline is working",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Connect to the database
DBConnection(); // Call the database connection function

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
