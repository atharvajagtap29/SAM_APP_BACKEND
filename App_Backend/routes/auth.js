// path: routes/authRoutes.js

const express = require("express");
const router = express.Router();

// Auth Dependencies
const { registerUser, loginUser, logoutUser } = require("../controllers/auth");
const hashUserPassword = require("../middlewares/hashUserPass");
const comparePasswordForAuthentication = require("../middlewares/authComparePass");

// Register route with middleware
router.post("/register", hashUserPassword, registerUser);

// Login route with middleware
router.post("/login", comparePasswordForAuthentication, loginUser);

// Logout user
router.post("/logout", logoutUser);

module.exports = router;
