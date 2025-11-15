import express from "express";
import { createCheckoutSession } from "../controllers/payment/paymentController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", requireSignIn, createCheckoutSession);

export default router;
