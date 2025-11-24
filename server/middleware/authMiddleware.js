import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";

// -----------------------------------------
// 🔐 REQUIRE SIGN IN
// -----------------------------------------
export const requireSignIn = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { _id: 'mongoId' }
    const user = await UserModel.findById(decoded._id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// -----------------------------------------
// 👑 CHECK ADMIN ROLE
// -----------------------------------------
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Your DB stores role: "admin" / "user"
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
});
