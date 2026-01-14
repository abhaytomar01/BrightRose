// server/routes/cartRoutes.js
import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearMyCart,
} from "../controllers/cart/cartController.js";

const router = express.Router();

router.get("/my-cart", requireSignIn, getMyCart);
router.post("/add", requireSignIn, addToCart);
router.put("/update/:id", requireSignIn, updateCartItem);
router.delete("/remove/:id", requireSignIn, removeCartItem);
router.delete("/clear", requireSignIn, clearMyCart);

export default router;
