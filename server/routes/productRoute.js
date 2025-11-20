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
import upload from "../utils/multer.js";   // <-- ADDED
//router object
const router = express.Router();


// =====================================
// 📸 PRODUCT IMAGE UPLOAD ROUTE
// =====================================
router.post(
  "/new-product",
  isAdmin,
  upload.array("images", 6),  // <-- Required for Cloudinary image upload
  newProduct
);



// =====================================
// EXISTING PRODUCT ROUTES
// =====================================

// Get All Products
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL PRODUCTS (Public)
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// Add new product
router.post("/new-product", requireSignIn, isAdmin, newProduct);

// Get Seller Product
router.get("/seller-product", isAdmin, getSellerProducts);

// Delete Product
router.post("/delete-product", isAdmin, deleteProduct);

// Find filtered product
router.get("/filtered-products", getFilteredProducts);

// Search products using keyword
router.get("/search/:keyword", searchProductController);

// Find product details
router.get("/:id", findProduct);

// Update product
router.patch("/update/:id", isAdmin, updateProduct);

export default router;
