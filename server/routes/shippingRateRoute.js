import express from "express";
import {
  listRates,
  getRate,
  upsertRate,
  deleteRate,
} from "../controllers/payment/shippingRateController.js";

import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * =====================================
 * 🔐 ADMIN ROUTES — Shipping Rates
 * =====================================
 * These routes are ONLY for admin panel
 * Not accessible to public users
 */

// Create or Update shipping rate (Upsert)
router.post("/rate", requireSignIn, isAdmin, upsertRate);

// Delete shipping rate
router.delete("/rate/:id", requireSignIn, isAdmin, deleteRate);

// Get all shipping rates (Admin view)
router.get("/rates", requireSignIn, isAdmin, listRates);

// Get single country rate (optional admin use)
router.get("/rate/:country", requireSignIn, isAdmin, getRate);

export default router;
