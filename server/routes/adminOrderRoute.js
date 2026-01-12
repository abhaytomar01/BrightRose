import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { getAllOrdersAdmin } from "../controllers/order/adminOrderController.js";

const router = express.Router();

router.get("/orders", requireSignIn, isAdmin, getAllOrdersAdmin);

export default router;
