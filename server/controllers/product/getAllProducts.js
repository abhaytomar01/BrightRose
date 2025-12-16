import productModel from "../../models/productModel.js";

const getAllProducts = async (req, res) => {
  try {
    let products = await productModel.find().sort({ createdAt: -1 });

    const BASE = "https://www.thebrightrose.com";

    products = products.map((p) => {
      // Normalize images
      p.images = (p.images || []).map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("http")
          ? img.url
          : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
      }));

      // Fallback image
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

export default getAllProducts;
