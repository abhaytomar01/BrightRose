import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", requireSignIn, createCheckoutSession);

export default router;
