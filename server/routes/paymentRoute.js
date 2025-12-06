import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment/paymentController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// If you allow guest checkout, remove requireSignIn here also
router.post("/create-order", requireSignIn, createOrder);

// NEVER protect verify-payment — Razorpay returns even if user logged out
router.post("/verify-payment", verifyPayment);

export default router;
