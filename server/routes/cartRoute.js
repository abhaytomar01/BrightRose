import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/product/cartController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Require auth for all cart routes
router.post("/add", requireSignIn, addToCart);
router.get("/:userId", requireSignIn, getCart);
router.put("/update/:id", requireSignIn, updateCartItem);
router.delete("/remove/:id", requireSignIn, removeFromCart);
router.delete("/clear/:userId", requireSignIn, clearCart);


export default router;
