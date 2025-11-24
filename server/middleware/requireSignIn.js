import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { _id: "mongoId" }
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

export const isAdmin = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  
  if (user.role !== 1)
    return res.status(403).json({ success: false, message: "Access denied" });
  next();
};
