// controllers/auth/loginController.js
import JWT from "jsonwebtoken";
import { comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

// Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const match = await comparePassword(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};