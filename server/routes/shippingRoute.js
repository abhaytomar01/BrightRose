// server/routes/shippingRoute.js
import express from "express";
import { calculateShipping } from "../controllers/shipping/shippingController.js";

const router = express.Router();

router.post("/calculate", calculateShipping);

export default router;
