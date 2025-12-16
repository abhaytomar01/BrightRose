import productModel from "../../models/productModel.js";

const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const BASE = "https://www.thebrightrose.com";

    // Normalize image URLs
    product.images = (product.images || []).map((img) => ({
      filename: img.filename,
      url: img.url.startsWith("http")
        ? img.url
        : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
    }));

    // Fallback image
    if (!product.images.length) {
      product.images = [
        {
          url: `${BASE}/uploads/fallback.jpg`,
          filename: "fallback.jpg",
        },
      ];
    }

    return res.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("GET SINGLE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export default getSingleProduct;
