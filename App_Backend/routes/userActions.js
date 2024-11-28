const express = require("express");
const router = express.Router();

const verifyRole = require("../middlewares/verifyRole");
const verifyToken = require("../middlewares/verifyToken");

// Roles
const { ROLE_TYPES } = require("../helpers/constants");

// Controllers
const {
  adminSpecificRoute,
  viewerSpecificRoute,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  changeUserRole,
} = require("../controllers/userActions");

router.get(
  "/greet_admin",
  verifyToken,
  verifyRole(ROLE_TYPES.ADMIN),
  adminSpecificRoute
);

router.get(
  "/greet_viewer",
  verifyToken,
  verifyRole(ROLE_TYPES.VIEWER),
  viewerSpecificRoute
);

router.get("/get", verifyToken, getAllUsers);

router.get("/getById", verifyToken, getUserById);

router.put("/updateUser", verifyToken, updateUser);

router.delete("/deleteUser", verifyToken, deleteUser);

router.patch(
  "/changePass",
  verifyToken,
  verifyRole(ROLE_TYPES.ADMIN),
  changePassword
);

router.patch(
  "/changeRole/:id/:newRole",
  verifyToken,
  verifyRole(ROLE_TYPES.ADMIN),
  changeUserRole
);

module.exports = router;
