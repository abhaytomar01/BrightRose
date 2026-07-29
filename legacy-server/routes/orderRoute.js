// server/routes/orderRoute.js
import express from "express";
import {
  createCodOrder,
  getUserOrders,
  getOrderById,         // user view
  getOrderByIdAdmin,    // admin single order
  getAllOrders, 
  updateOrderStatus,
  cancelOrder,
  addTrackingUpdate
} from "../controllers/user/orderController.js";

import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER routes (protected)
router.post("/create-cod", requireSignIn, createCodOrder);
router.get("/my-orders", requireSignIn, getUserOrders);
router.get("/order/:id", requireSignIn, getOrderById); // user's single order view
router.patch("/cancel/:id", requireSignIn, cancelOrder); // user can cancel their order

// ADMIN routes (protected + admin)
router.get("/admin/orders", requireSignIn, isAdmin, getAllOrders);
router.get("/admin/order/:id", requireSignIn, isAdmin, getOrderByIdAdmin); // admin single order
router.put("/admin/order-status/:id", requireSignIn, isAdmin, updateOrderStatus);
router.post("/admin/order-status/:id/tracking", requireSignIn, isAdmin, addTrackingUpdate);

export default router;
