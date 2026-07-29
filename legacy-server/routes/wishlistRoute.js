import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import { getWishlist } from "../controllers/user/getWishlist.js";
import { toggleWishlist } from "../controllers/user/toggleWishlist.js";

const router = express.Router();

router.get("/list", requireSignIn, getWishlist);
router.post("/toggle", requireSignIn, toggleWishlist);

export default router;
