import User from "../../models/userModel.js";

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If exists -> remove
    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
      return res.status(200).json({ success: true, action: "removed" });
    }

    // Else add
    user.wishlist.push(productId);
    await user.save();
    return res.status(200).json({ success: true, action: "added" });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to update wishlist",
      err,
    });
  }
};
