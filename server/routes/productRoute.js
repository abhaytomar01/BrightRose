import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

import newProduct from "../controllers/product/newProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";

const router = express.Router();

router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 10 }]),
  newProduct
);

router.patch(
  "/update/:id",
  requireSignIn,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateProduct
);

export default router;
