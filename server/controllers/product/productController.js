// controllers/product/productController.js
import productModel from "../../models/productModel.js";

// ===============================
// GET ALL PRODUCTS
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// ===============================
export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
