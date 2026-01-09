// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// -----------------------------------------
// 🔐 REQUIRE SIGN IN
// -----------------------------------------
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in env");
      return res.status(500).json({
        success: false,
        message: "Auth configuration error",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ JWT verify failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded._id).select("_id name email role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// -----------------------------------------
// 👑 ADMIN ONLY
// -----------------------------------------
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access denied",
    });
  }
  next();
};

