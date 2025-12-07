import express from "express";
import { registerController } from "../controllers/auth/registerController.js";
import { loginController } from "../controllers/auth/loginController.js";
import { testController } from "../controllers/auth/testController.js";
import { userCheckController } from "../controllers/auth/userExist.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.js";
import { updateDetailsController } from "../controllers/auth/updateDetails.js";
import { deactivateController } from "../controllers/auth/deactivateAccount.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", registerController);

// USER LOGIN
router.post("/login", loginController);

// ADMIN LOGIN (NEW)
router.post("/admin-login", loginController);

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
