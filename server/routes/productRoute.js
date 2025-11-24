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

// ⬅️ Multer upload middleware (Cloudinary storage)
import upload from "../utils/multer.js";

const router = express.Router();

/* =====================================
   📸 PRODUCT IMAGE UPLOAD + CREATE
   This route will upload images to Cloudinary
   & then create the product in MongoDB
===================================== */
router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  upload.array("images", 6), // Accept up to 6 images
  newProduct
);

/* =====================================
   📌 PUBLIC ROUTES
===================================== */

// GET all products (same as /products)
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// GET All Products (duplicate but kept if you need older API)
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Find filtered product
router.get("/filtered-products", getFilteredProducts);

// Search
router.get("/search/:keyword", searchProductController);

// Product Details Page (Single Product)
router.get("/:id", findProduct);

/* =====================================
   🔐 ADMIN ROUTES
===================================== */

// Seller products
router.get("/seller-product", requireSignIn, isAdmin, getSellerProducts);

// Delete product
router.post("/delete-product", requireSignIn, isAdmin, deleteProduct);

// Update product
router.patch("/update/:id", requireSignIn, isAdmin, upload.array("images", 6), updateProduct);

export default router;
