const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// ROLE SPECIFIC
const adminSpecificRoute = async (req, res) => {
  try {
    // Respond with admin-specific data or message
    res.status(200).json({
      message: "Welcome, Admin!",
      success: true,
      actions: ["View All Users", "Manage Roles", "Access System Settings"],
    });
  } catch (error) {
    console.error("Error in adminSpecificRoute:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewerSpecificRoute = async (req, res) => {
  try {
    // Respond with viewer-specific data or message
    res.status(200).json({
      message: "Welcome, Viewer!",
      success: true,
      actions: ["View Your Profile", "Browse Content"],
    });
  } catch (error) {
    console.error("Error in viewerSpecificRoute:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET, UPDATE, DELETE
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.status(200).json({
      message: "Users retrieved successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(`Error in userActions controller >>>> ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    console.log(
      `Here is the user info ${req.user.id}, & ${req.user.username}, & ${req.user.role}`
    );

    const id = req.user.id; // Extract user ID as a plain string

    // Pass the plain ID directly to findById
    const user = await User.findById(id).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User fetched successfully.",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID (ObjectId) from authenticated request
    const updates = req.body;

    // Ensure password field is not accidentally updated
    if (updates.password) {
      return res.status(400).json({
        message:
          "Password update is not allowed here. Use changePassword instead.",
      });
    }

    // Update the user document with the provided fields
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.user; // Extract user ID from decoded JWT token

    const deletedUser = await User.findOneAndDelete({ id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully.", success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.user; // Extract user ID from JWT
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both oldPassword and newPassword are required." });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare oldPassword with the current hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully.", success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// CHANGE ROLE
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the user whose role we want to change
    const { newRole } = req.params; // The new role to assign

    if (!newRole) {
      return res.status(400).json({ message: "New role is required." });
    }

    // Find the user whose role is being updated
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's role
    userToUpdate.role = newRole;
    await userToUpdate.save();

    res
      .status(200)
      .json({
        message: `User role updated to ${newRole} successfully.`,
        success: true,
      });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  adminSpecificRoute,
  viewerSpecificRoute,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  changeUserRole,
};
