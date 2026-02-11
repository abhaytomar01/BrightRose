// controllers/product/productController.js
import productModel from "../../models/productModel.js";

// ===============================
// GET ALL PRODUCTS
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    let products = await productModel.find().sort({ createdAt: -1 });

    const BASE = "https://www.thebrightrose.com";

    products = products.map((p) => {
      p.images = (p.images || []).map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("http")
          ? img.url
          : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
      }));

      if (!p.images.length) {
        p.images = [
          {
            url: `${BASE}/uploads/fallback.jpg`,
            filename: "fallback.jpg",
          },
        ];
      }

      return p;
    });

    return res.json({ success: true, products });
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
    const BASE = "https://www.thebrightrose.com";

    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.images = (product.images || []).map((img) => ({
      filename: img.filename,
      url: img.url.startsWith("http")
        ? img.url
        : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
    }));

    if (!product.images.length) {
      product.images = [
        {
          url: `${BASE}/uploads/fallback.jpg`,
          filename: "fallback.jpg",
        },
      ];
    }

    return res.json({ success: true, product });
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

// ===============================
// FILTER PRODUCTS
// ===============================
// controllers/product/productController.js
export const filterProducts = async (req, res) => {
  try {
    console.log("RAW QUERY:", req.query);  // 👈 add this

    const {
      category,
      weavingSlug,
      tagSlugs,
      size,
      color,
      priceMin,
      priceMax,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (weavingSlug) filter.weavingSlug = weavingSlug;
    if (tagSlugs) filter.tagSlugs = tagSlugs;

    if (size) filter.sizes = size;  // match any element in sizes array

    if (color) {
      filter.color = {
        $regex: color.trim(),
        $options: "i",
      };
    }

    if (priceMin !== undefined && priceMax !== undefined) {
      filter.price = {
        $gte: Number(priceMin) || 0,
        $lte: Number(priceMax) || 200000,
      };
    }

    console.log("FILTER:", filter);  // already there

    const products = await productModel.find(filter);

    return res.json({
      products,
      count: products.length,
    });
  } catch (err) {
    console.error("filterProducts error:", err);
    res.status(500).json({ error: "Failed to filter products" });
  }
};

