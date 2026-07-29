// controllers/auth/registerController.js
import JWT from "jsonwebtoken";
import { hashPassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }

    const hashed = await hashPassword(password);

    const user = await userModel.create({
      name,
      email,
      phone,
      passwordHash: hashed,   // ✅ FIXED
      role: "user",
    });

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).send({
      success: true,
      message: "Registration successful",
      user,
      token,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Register error",
    });
  }
};
