// controllers/auth/loginController.js
import JWT from "jsonwebtoken";
import { comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
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

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Incorrect password",
      });
    }

    // Detect login type
    const isAdminLogin = req.originalUrl.includes("admin-login");
    const isUserLogin = req.originalUrl.includes("login");

    // Admin login validation
    if (isAdminLogin && user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }

    // User login validation
    if (isUserLogin && !isAdminLogin && user.role === "admin") {
      return res.status(403).send({
        success: false,
        message: "Admins must login via admin-login",
      });
    }

    // Generate JWT
    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
    console.log("LOGIN ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};
