// controllers/product/productController.js
import productModel from "../../models/productModel.js";

// ===============================
// GET ALL PRODUCTS
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    let products = await productModel.find().sort({ createdAt: -1 });

    // Auto add fallback image if missing
    products = products.map((p) => {
      if (!p.images || p.images.length === 0) {
        p.images = [
          {
            url: "https://www.thebrightrose.com/uploads/fallback.jpg",
            filename: "fallback.jpg",
          },
        ];
      }
      return p;
    });

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

    // Auto add fallback image if product has no images
    if (!product.images || product.images.length === 0) {
      product.images = [
        {
          url: "https://www.thebrightrose.com/uploads/fallback.jpg",
          filename: "fallback.jpg",
        },
      ];
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
