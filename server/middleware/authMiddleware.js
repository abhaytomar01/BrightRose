// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// -----------------------------------------
// 🔐 REQUIRE SIGN IN
// -----------------------------------------
// server/middleware/authMiddleware.js
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      console.error("AUTH ERROR: Missing Bearer header");
      return res.status(401).json({ success: false, message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("AUTH ERROR: JWT_SECRET missing");
      return res.status(500).json({ success: false, message: "Auth configuration error" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("AUTH ERROR: JWT verify failed:", err.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded._id).select("_id name email role");

    if (!user) {
      console.error("AUTH ERROR: User not found for id:", decoded._id);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR: Middleware exception:", err);
    return res.status(500).json({ success: false, message: "Authentication failed" });
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

