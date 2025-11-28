import express from "express";
import { toggleWishlist, getWishlist } from "../controllers/product/wishlistController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// FIX: use requireSignIn (correct name)
router.post("/toggle", requireSignIn, toggleWishlist);
router.get("/", requireSignIn, getWishlist);

export default router;
