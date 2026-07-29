// controllers/product/searchProductController.js
import Product from "../../models/productModel.js";

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const term = (keyword || "").trim();

    if (!term) {
      return res.status(200).json({ products: [] });
    }

    const regex = new RegExp(term, "i");

    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { fabric: regex },
        { color: regex },
        { weavingArt: regex },
        { tags: regex },
      ],
    })
      .select("name price discountPrice images") // discountPrice only if you add it later
      .limit(20);

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Search Product Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while searching for products",
      error: error.message,
    });
  }
};

export default searchProductController;
