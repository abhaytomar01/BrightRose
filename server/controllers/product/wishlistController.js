import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// GET wishlist with full product details
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    return res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load wishlist",
    });
  }
};

// TOGGLE wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
      return res.status(200).json({ success: true, action: "removed" });
    }

    user.wishlist.push(productId);
    await user.save();
    return res.status(200).json({ success: true, action: "added" });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to update wishlist",
    });
  }
};
