// controllers/auth/loginController.js
import JWT from "jsonwebtoken";
import { comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Compare password (note: field name passwordHash)
    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Incorrect password",
      });
    }

    // Detect whether hitting /admin-login or /login
    const orig = req.originalUrl || req.url || "";
    const isAdminLogin = orig === "/api/v1/auth/admin-login" || orig.endsWith("/admin-login");
    const isUserLogin = orig === "/api/v1/auth/login" || orig.endsWith("/login");

    // Admin login rules
    if (isAdminLogin && user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }

    // Disallow admin logging in from user login
    if (isUserLogin && user.role === "admin") {
      return res.status(403).send({
        success: false,
        message: "Admins must login via admin-login",
      });
    }

    // Generate token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user (omit sensitive fields)
    return res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
