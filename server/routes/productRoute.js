import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

import newProduct from "../controllers/product/newProduct.js";
import getSellerProducts from "../controllers/product/getSellerProducts.js";
import deleteProduct from "../controllers/product/deleteProduct.js";
import findProduct from "../controllers/product/findProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";
import getFilteredProducts from "../controllers/product/getFilteredProducts.js";
import searchProductController from "../controllers/product/searchProductController.js";

import productModel from "../models/productModel.js";

const router = express.Router();

/* =====================================
   📸 CREATE NEW PRODUCT (Base64 Images)
===================================== */
router.post("/new-product", requireSignIn, isAdmin, newProduct);

/* =====================================
   📌 PUBLIC ROUTES
===================================== */

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// Duplicate old endpoint (optional)
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filtered products
router.get("/filtered-products", getFilteredProducts);

// Search products
router.get("/search/:keyword", searchProductController);

// Get single product details
router.get("/:id", findProduct);

/* =====================================
   🔐 ADMIN ROUTES
===================================== */

// Get seller products
router.get("/seller-product", requireSignIn, isAdmin, getSellerProducts);

// Delete product
router.post("/delete-product", requireSignIn, isAdmin, deleteProduct);

// Update product (base64 images)
router.patch("/update/:id", requireSignIn, isAdmin, updateProduct);

export default router;
