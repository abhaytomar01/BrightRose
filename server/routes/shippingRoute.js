// server/routes/shippingRoute.js
import express from "express";
import { calculateShipping } from "../controllers/shipping/shippingController.js";

const router = express.Router();

// Keep old endpoint if anything uses it:
router.post("/calculate", calculateShipping);

// NEW: match frontend call /api/v1/shipping/delhivery
router.post("/delhivery", calculateShipping);

export default router;
