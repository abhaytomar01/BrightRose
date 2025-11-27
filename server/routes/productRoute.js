import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

import newProduct from "../controllers/product/newProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";
import getAllProducts from "../controllers/product/getAllProducts.js";
import getSingleProduct from "../controllers/product/getSingleProduct.js";
import deleteProduct from "../controllers/product/deleteProduct.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// ADMIN
router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  upload.array("images", 10),
  newProduct
);

router.patch(
  "/update/:id",
  requireSignIn,
  isAdmin,
  upload.array("images", 10),
  updateProduct
);

router.delete(
  "/delete/:id",
  requireSignIn,
  isAdmin,
  deleteProduct
);

export default router;
