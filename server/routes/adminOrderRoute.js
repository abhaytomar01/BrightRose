// server/routes/adminOrderRoute.js
import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllOrdersAdmin,
  getSingleOrderAdmin,
  updateOrderStatusAdmin,
} from "../controllers/order/adminOrderController.js";

const router = express.Router();

router.get("/orders", requireSignIn, isAdmin, getAllOrdersAdmin);
router.get("/order/:id", requireSignIn, isAdmin, getSingleOrderAdmin);
router.put("/order-status/:id", requireSignIn, isAdmin, updateOrderStatusAdmin);

export default router;
