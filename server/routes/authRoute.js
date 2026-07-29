import express from "express";
import { registerController } from "../controllers/auth/registerController.js";
import { loginController } from "../controllers/auth/loginController.js";
import { testController } from "../controllers/auth/testController.js";
import { userCheckController } from "../controllers/auth/userExist.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.js";
import { updateDetailsController } from "../controllers/auth/updateDetails.js";
import { deactivateController } from "../controllers/auth/deactivateAccount.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { adminLoginController } from "../controllers/auth/adminLoginController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." }
});

// REGISTER
router.post("/register", authLimiter, registerController);

// USER LOGIN
router.post("/login", authLimiter, loginController);

// ADMIN LOGIN (NEW)
router.post("/admin-login", authLimiter, adminLoginController);

// USER EXIST
router.post("/user-exist", userCheckController);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPasswordController);

// PROTECTED USER ROUTE
router.get("/test", requireSignIn, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROTECTED ADMIN ROUTE
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
console.log("JWT SECRET:", process.env.JWT_SECRET);

// PROFILE UPDATE
router.post("/update-details", updateDetailsController);

// DEACTIVATE ACCOUNT
router.post("/deactivate", deactivateController);

export default router;
