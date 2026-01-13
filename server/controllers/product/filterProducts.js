// server/controllers/product/filterProducts.js
import productModel from "../../models/productModel.js";

const filterProducts = async (req, res) => {
  try {
    const {
      category,
      weave,     // slug, e.g. "plain", "kanchipuram"
      style,     // slug, e.g. "corsets", "saree"
      color,
      priceMin = 0,
      priceMax = 100000,
      sort,
    } = req.query;

    const min = Number(priceMin) || 0;
    const max = Number(priceMax) || 100000;

    const filter = {};

    // CATEGORY (if you start using it later)
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // WEAVE -> weavingSlug
    if (weave) {
      filter.weavingSlug = weave;
    }

    // STYLE -> tagSlugs array
    if (style) {
      filter.tagSlugs = { $in: [style] };
    }

    // COLOR (optional)
    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }

    // PRICE
    filter.price = { $gte: min, $lte: max };

    // SORT
    let sortQuery = { createdAt: -1 };
    switch (sort) {
      case "priceAsc":
        sortQuery = { price: 1 };
        break;
      case "priceDesc":
        sortQuery = { price: -1 };
        break;
      case "oldest":
        sortQuery = { createdAt: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    console.log("FILTER QUERY:", req.query, filter, sortQuery);

    let products = await productModel.find(filter).sort(sortQuery);

    const BASE = "https://www.thebrightrose.com";

    products = products.map((p) => {
      p.images = (p.images || []).map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("http")
          ? img.url
          : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
      }));

      if (!p.images.length) {
        p.images = [{ url: `${BASE}/uploads/fallback.jpg`, filename: "fallback.jpg" }];
      }

      return p;
    });

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("FILTER API ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filtered products",
    });
  }
};

export default filterProducts;
