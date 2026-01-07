// server/routes/paymentRoute.js
import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment/paymentController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/payment/create-order
 * @desc    Create Razorpay order
 * @access  Private (user must be logged in)
 */
router.post("/create-order", requireSignIn, createRazorpayOrder);

/**
 * @route   POST /api/v1/payment/verify
 * @desc    Verify Razorpay payment signature
 * @access  Public (Razorpay callback / frontend)
 */
router.post("/verify", verifyRazorpayPayment);

export default router;
