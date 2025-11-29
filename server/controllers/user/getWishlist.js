// controllers/wishlist/getWishlist.js
import User from "../../models/userModel.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "wishlist",
      "name price images"   // return only required fields
    );

    return res.status(200).json({
      success: true,
      wishlist: user?.wishlist || []
    });
  } catch (err) {
    console.error("Wishlist fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load wishlist"
    });
  }
};
