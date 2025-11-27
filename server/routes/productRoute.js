import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

import newProduct from "../controllers/product/newProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";
import {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
} from "../controllers/product/productController.js";

const router = express.Router();

// CREATE PRODUCT (multipart)
router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 10 }]),
  newProduct
);

// UPDATE PRODUCT (multipart)
router.patch(
  "/update/:id",
  requireSignIn,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateProduct
);

// GET ALL PRODUCTS 
router.get("/", getAllProducts);

// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);

// DELETE PRODUCT
router.delete(
  "/delete/:id",
  requireSignIn,
  isAdmin,
  deleteProduct
);

export default router;
