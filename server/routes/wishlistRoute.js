import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/list", requireSignIn, getWishlist);
router.post("/toggle", requireSignIn, toggleWishlist);

export default router;
