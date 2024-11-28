const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Role information missing" });
      }

      if (req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error verifying role:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = verifyRole;
