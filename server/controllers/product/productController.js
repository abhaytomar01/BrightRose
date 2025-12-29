// controllers/product/productController.js
import productModel from "../../models/productModel.js";

// ===============================
// GET ALL PRODUCTS
// ===============================
// ===============================
// GET ALL PRODUCTS (FIXED URL)
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    let products = await productModel.find().sort({ createdAt: -1 });

    const BASE = "https://www.thebrightrose.com";

    products = products.map((p) => {
      // Format images correctly
      p.images = (p.images || []).map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("http")
          ? img.url
          : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`
      }));

      // fallback
      if (!p.images.length) {
        p.images = [
          {
            url: `${BASE}/uploads/fallback.jpg`,
            filename: "fallback.jpg"
          }
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
// ===============================
// GET SINGLE PRODUCT (FIXED URL)
// ===============================
export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const BASE = "https://www.thebrightrose.com";

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Fix URLs
    product.images = (product.images || []).map((img) => ({
      filename: img.filename,
      url: img.url.startsWith("http")
        ? img.url
        : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
    }));

    // fallback
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
// FILTER PRODUCTS (Production Ready)
// ===============================
export const filterProducts = async (req, res) => {
  try {
    const {
      weave,
      style,
      priceMin = 0,
      priceMax = 100000
    } = req.query;

    const query = {};

    // WEAVE FILTER
    if (weave) query.weavingSlug = weave;

    // STYLE FILTER
    if (style) query.tagSlugs = { $in: [style] };

    // PRICE FILTER
    query.price = { $gte: priceMin, $lte: priceMax };

    let products = await productModel.find(query).sort({ createdAt: -1 });

    const BASE = "https://www.thebrightrose.com";

    // Fix image URLs
    products = products.map((p) => {
      p.images = (p.images || []).map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("http")
          ? img.url
          : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`
      }));

      if (!p.images.length) {
        p.images = [
          {
            url: `${BASE}/uploads/fallback.jpg`,
            filename: "fallback.jpg"
          }
        ];
      }

      return p;
    });

    return res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("FILTER PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to filter products"
    });
  }
};

