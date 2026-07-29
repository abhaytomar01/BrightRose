// server/routes/paymentRoute.js
import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment/paymentController.js";
import { paymentWebhook } from "../controllers/payment/paymentWebhook.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: { success: false, message: "Too many payment attempts, please try again later." }
});

router.post("/create-order", paymentLimiter, createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.post("/webhook", paymentWebhook);


export default router;
