const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const comparePasswordForAuthentication = async (req, res, next) => {
  try {
    // Fetch user-provided login information
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide both username and password",
      });
    }

    // Check if the user exists in the database based on the username
    const users = await User.find({ username });

    // If user is not found
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = users[0]; // Access the first user in the array

    // Check if the user has a password field
    if (!user.password) {
      return res.status(400).json({ message: "User password is not set" });
    }

    // Compare password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // If password matches, proceed to the next middleware (login controller)
    req.user = user; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Error checking hashed password:", error);
    res.status(500).json({ message: "Error processing password comparison" });
  }
};

module.exports = comparePasswordForAuthentication;
