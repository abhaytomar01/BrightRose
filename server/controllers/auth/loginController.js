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

    // Compare password
    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Incorrect password",
      });
    }

    // Detect login route accurately
    const isAdminLogin = req.originalUrl.includes("/admin-login");
    const isUserLogin = req.originalUrl.includes("/login");

    // Admin only check
    if (isAdminLogin && user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }

    // Stop admins logging through normal login
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
