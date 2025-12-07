
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";

/**
 * Verify user token & attach user to req.user
 */
export const requireSignIn = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
console.log("SERVER JWT SECRET:", process.env.JWT_SECRET);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch user from DB (omit passwordHash)
    const user = await UserModel.findById(decoded._id || decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
});

/**
 * Check admin role. Use after requireSignIn
 */
export const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Accept both 'admin' or numeric legacy role 1
    if (req.user.role !== "admin" && req.user.role !== 1) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (err) {
    console.error("Admin check error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
