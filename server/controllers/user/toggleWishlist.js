// controllers/wishlist/toggleWishlist.js
import User from "../../models/userModel.js";

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const exists = user.wishlist.includes(productId);

    if (exists) {
      user.wishlist.pull(productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      action: exists ? "removed" : "added",
      wishlist: user.wishlist
    });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update wishlist"
    });
  }
};
