const bcrypt = require("bcryptjs");

const hashUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is a required field" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error hashing password:", error); // Fixed undefined variable `err` to `error`
    res.status(500).json({ message: "Error processing password" });
  }
};

module.exports = hashUserPassword;
