import userModel from "../../models/userModel.js";
import productModel from "../../models/productModel.js";

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ success: false, message: "Product ID missing" });

    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const exists = user.wishlist.includes(productId);

    // REMOVE from wishlist
    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );
      await user.save();
      return res.json({ success: true, action: "removed" });
    }

    // ADD to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.json({ success: true, action: "added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("wishlist");

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
