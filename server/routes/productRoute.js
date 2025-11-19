import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import newProduct from "../controllers/product/newProduct.js";
import getSellerProducts from "../controllers/product/getSellerProducts.js";
import deleteProduct from "../controllers/product/deleteProduct.js";
import findProduct from "../controllers/product/findProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";
import getFilteredProducts from "../controllers/product/getFilteredProducts.js";
import searchProductController from "../controllers/product/searchProductController.js";

import productModel from "../models/productModel.js"; // adjust path if needed


//router object
const router = express.Router();


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


//Add new product POST
router.post("/new-product", isAdmin, newProduct);

//Get Seller Product
router.get("/seller-product", isAdmin, getSellerProducts);

//Delete Product
router.post("/delete-product", isAdmin, deleteProduct);

//find filtered product
router.get("/filtered-products", getFilteredProducts);

// search products using keyword
router.get("/search/:keyword", searchProductController);

//find product details from product id
router.get("/:id", findProduct);

//update product details from product id
router.patch("/update/:id", isAdmin, updateProduct);



export default router;