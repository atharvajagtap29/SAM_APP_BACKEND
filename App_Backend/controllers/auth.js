// path: controllers/auth.js

const User = require("../models/userModel");
const { ROLE_TYPES } = require("../helpers/constants");
const jwt = require("jsonwebtoken");

// Register controller to sign up a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  // Input validation (basic)
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists." });
    }

    // Create the new user with default role
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password, // Already hashed by middleware
      role: ROLE_TYPES.VIEWER, // Default role is VIEWER
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
      data: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Login controller to create JWT token
const loginUser = async (req, res) => {
  try {
    const user = req.user; // The user logged in user information passed from the comparePasswordForAuthentication middleware

    // Payload for JWT token
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    // Generate a jwt token. sign it with the current user via payload. provide jwt secret and token expiration time too
    // It means, from this token dev can fetch id, username and role [passed in the payload] of the user
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "1h", // Default expiration to 1h
    });

    // Set the JWT token in the HTTP cookie
    res.cookie("accessToken", token, {
      httpOnly: true, // Prevent client-side access to the cookie
      maxAge: parseInt(process.env.COOKIE_MAX_AGE) * 60 * 60 * 1000, // Convert from hours to milliseconds
      secure: process.env.NODE_ENV === "production", // Only set secure flag in production environment
      sameSite: "None", // Helps to prevent CSRF attacks
    });

    // Destructure req.user to exclude password. and send rest of the info to the frontend
    const { password, ...userInfo } = user.toObject();

    // Send the logged-in user information (without password) for frontend use
    res.status(200).json({
      message: "Login successful",
      success: true,
      data: userInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Remove the JWT token from the HTTP cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure flag in production environment
      sameSite: "None", // Helps to prevent CSRF attacks
    });

    res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
