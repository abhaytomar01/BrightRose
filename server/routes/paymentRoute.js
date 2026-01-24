// server/routes/paymentRoute.js
import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment/paymentController.js";
import { paymentWebhook } from "../controllers/payment/paymentWebhook.js";
// import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.post("/webhook", paymentWebhook);


export default router;
