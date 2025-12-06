import express from "express";
import { listRates, getRate, upsertRate, deleteRate } from "../controllers/payment/shippingRateController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireSignIn, isAdmin, listRates);
router.get("/:country", requireSignIn, isAdmin, getRate); // admin or public can read
router.post("/", requireSignIn, isAdmin, upsertRate);
router.delete("/:id", requireSignIn, isAdmin, deleteRate);

export default router;
