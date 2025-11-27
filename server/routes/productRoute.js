import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

import newProduct from "../controllers/product/newProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";

const router = express.Router();

// CREATE PRODUCT
router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  upload.array("images", 10),
  newProduct
);

// UPDATE PRODUCT
router.patch(
  "/update/:id",
  requireSignIn,
  isAdmin,
  upload.array("images", 10),
  updateProduct
);

export default router;
