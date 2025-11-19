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

    // Build MongoDB filter object
    const filter = {};

    if (category) filter.category = category;
    if (weave) filter.weavingArt = weave;
    if (style) filter.style = style;
    if (color) filter.color = color;
    if (ratings) filter.ratings = { $gte: Number(ratings) };

    // Price Filter
    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {
        ...(priceMin ? { $gte: Number(priceMin) } : {}),
        ...(priceMax ? { $lte: Number(priceMax) } : {}),
      };
    }

    // Sorting logic
    let sortQuery = {};

    switch (sort) {
      case "priceAsc":
        sortQuery = { price: 1 };
        break;

      case "priceDesc":
        sortQuery = { price: -1 };
        break;

      case "newest":
        sortQuery = { createdAt: -1 };
        break;

      case "oldest":
        sortQuery = { createdAt: 1 };
        break;

      default:
        sortQuery = { createdAt: -1 }; // default: newest
    }

    const products = await productModel
      .find(filter)
      .sort(sortQuery);

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Filter API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

export default getFilteredProducts;
