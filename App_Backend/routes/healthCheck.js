// healthCheck route
// path: C:\Users\Atharva JAgtap\OneDrive\Desktop\AWS_SAM\Serverless_Backend\my-sam-backend\App_Backend\routes\healthCheck.js

// routes/healthCheck.js
const express = require("express");
const router = express.Router();

const healthCheckFunction = require("../controllers/healthCheck");

// Directly register the controller function
router.get("/healthcheck", healthCheckFunction);

module.exports = router;
