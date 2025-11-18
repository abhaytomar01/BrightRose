import JWT from "jsonwebtoken";
import { hashPassword, comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

// Register
export const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !password || !phone || !address)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      passwordHash: hashedPassword,
    }).save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in registration", error });
  }
};


// Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const match = await comparePassword(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    // Generate token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};
