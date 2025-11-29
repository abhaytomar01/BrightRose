import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    
    return res.status(200).json({
      success: true,
      wishlist: user.wishlist,  // FULL product documents
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load wishlist"
    });
  }
};
