// controllers/auth/loginController.js
import JWT from "jsonwebtoken";
import { comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

// Login Controller (User + Admin)
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Detect current route
    const isAdminLogin = req.originalUrl.includes("/admin-login");
    const isUserLogin = req.originalUrl.includes("/login");

    // ADMIN LOGIN ONLY
    if (isAdminLogin) {
      if (user.role !== "admin") {
        return res.status(403).send({
          success: false,
          message: "Access denied. Admin login only.",
        });
      }
    }

    // USER LOGIN ONLY
    if (isUserLogin && !isAdminLogin) {
      if (user.role === "admin") {
        return res.status(403).send({
          success: false,
          message: "Admins must login using /admin-login",
        });
      }
    }

    // generate token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        _id: user._id,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login error",
      error,
    });
  }
};
