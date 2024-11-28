const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies.accessToken;

    // Log cookie object
    // console.log(req.cookies);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Access token is invalid" });
    }

    //   Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }

      req.user = decoded; // Attach the decoded payload, including the role

      //   Testing
      // console.log(
      //   `USER OBJECT AFTER SUCCESSFUL TOKEN VERIFICATION ${req.user}`
      // );

      next();
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyToken;
