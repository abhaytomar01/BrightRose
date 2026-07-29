import productModel from "../../models/productModel.js";

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category,
      weave,
      style,
      color,
      priceMin,
      priceMax,
      ratings,
      sort,
    } = req.query;

    const filter = {};

    // CATEGORY
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // WEAVE (FIXED FIELD NAME + CASE INSENSITIVE)
    if (weave) {
      filter.weave = { $regex: weave, $options: "i" };
    }

    // STYLE
    if (style) {
      filter.style = { $regex: style, $options: "i" };
    }

    // COLOR
    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }

    // RATINGS
    if (ratings && Number(ratings) > 0) {
      filter.ratings = { $gte: Number(ratings) };
    }

    // PRICE
    if (priceMin || priceMax) {
      filter.price = {
        ...(priceMin && { $gte: Number(priceMin) }),
        ...(priceMax && { $lte: Number(priceMax) }),
      };
    }

    // SORTING
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

    let products = await productModel.find(filter).sort(sortQuery);

    // FIX IMAGE URLS (SAME AS getAllProducts)
    const BASE = "https://www.thebrightrose.com";

    products = products.map((p) => {
      p.images = (p.images || []).map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("http")
          ? img.url
          : `${BASE}${img.url.startsWith("/") ? img.url : "/" + img.url}`,
      }));

      if (!p.images.length) {
        p.images = [{ url: `${BASE}/uploads/fallback.jpg` }];
      }

      return p;
    });

    return res.json({
      success: true,
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

export default getFilteredProducts;
