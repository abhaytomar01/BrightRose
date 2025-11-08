import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (user.role !== 1)
    return res.status(403).json({ success: false, message: "Access denied" });
  next();
};
