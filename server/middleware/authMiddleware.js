import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";

const requireSignIn = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Must include Bearer token format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1]; // remove "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Get user and attach to request
    req.user = await UserModel.findById(decoded.id || decoded._id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "JWT must be provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);

        // Attach user information to the request
        req.user = await UserModel.findById(decoded._id);
        // console.log(req.user);
        if (!req.user || req.user.role !== 1) {
            return res
                .status(403)
                .json({ message: "Access denied. Admin privileges required." });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

export { requireSignIn, isAdmin };


// import JWT from "jsonwebtoken";
// import userModel from "../models/userModel.js";
// import asyncHandler from "express-async-handler";

// //Protected routes token based
// export const requireSignIn = asyncHandler(async (req, res, next) => {
//     try {
//         const token = req.headers?.authorization;
//         // console.log(token);
//         if (!token) {
//             return res.status(401).send({
//                 success: false,
//                 message: "JWT must be provided",
//                 ok: false,
//             });
//         }
//         const decode = JWT.verify(token, process.env.JWT_SECRET);
//         // Set the user information given in token payload
//         req.user = decode;
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Invalid JWT",
//         });
//     }
// });

// //ADMIN access
// export const isAdmin = asyncHandler(async (req, res, next) => {
//     try {
//         const user = await userModel.findById(req.user._id);
//         if (user.role !== 1) {
//             return res.status(401).send({
//                 success: false,
//                 message: "User is not Admin",
//                 ok: false,
//             });
//         }
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             error,
//             message: "Error in admin middleware",
//         });
//     }
// });
