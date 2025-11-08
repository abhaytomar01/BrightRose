import productModel from "../../models/productModel.js";

const getFilteredProducts = async (req, res) => {
  try {
    // Extract query params
    const {
      category,
      color,
      size,
      weave,
      style,
      priceMin,
      priceMax,
      ratings,
      sort,
      page = 1,
      limit = 50,
    } = req.query;

    // Build dynamic query
    const query = {};

    if (category && category !== "all") {
      query.category = { $regex: category, $options: "i" };
    }

    if (color && color !== "all") {
      query.color = { $regex: color, $options: "i" };
    }

    if (size && size !== "all") {
      query.size = { $in: [size] }; // handle multiple sizes
    }

    if (weave && weave !== "all") {
      query.weave = { $regex: weave, $options: "i" };
    }

    if (style && style !== "all") {
      query.style = { $regex: style, $options: "i" };
    }

    // Price range filter
    if (priceMin || priceMax) {
      query.discountPrice = {};
      if (priceMin) query.discountPrice.$gte = Number(priceMin);
      if (priceMax) query.discountPrice.$lte = Number(priceMax);
    }

    // Ratings filter
    if (ratings && !isNaN(ratings)) {
      query.ratings = { $gte: Number(ratings) };
    }

    // Base query
    let productsQuery = productModel.find(query);

    // Sorting logic
    if (sort) {
      switch (sort) {
        case "price_asc":
          productsQuery = productsQuery.sort({ discountPrice: 1 });
          break;
        case "price_desc":
          productsQuery = productsQuery.sort({ discountPrice: -1 });
          break;
        case "newest":
          productsQuery = productsQuery.sort({ createdAt: -1 });
          break;
        case "top_rated":
          productsQuery = productsQuery.sort({ ratings: -1 });
          break;
        default:
          break;
      }
    }

    // Pagination
    const skip = (page - 1) * limit;
    productsQuery = productsQuery.skip(skip).limit(Number(limit));

    // Fetch products
    const products = await productsQuery.exec();
    const totalProducts = await productModel.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching filtered products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered products",
      error: error.message,
    });
  }
};

export default getFilteredProducts;
