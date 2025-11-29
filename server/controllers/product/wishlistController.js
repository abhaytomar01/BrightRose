

// wishlistController.js

export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.body;

  if (!user) return res.status(404).send({ success: false });

  const exists = user.wishlist.includes(productId);

  if (exists) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    return res.send({
      success: true,
      action: "removed",
      wishlist: user.wishlist, // always IDs
    });
  }

  user.wishlist.push(productId);
  await user.save();
  return res.send({
    success: true,
    action: "added",
    wishlist: user.wishlist, // always IDs
  });
};


// GET USER WISHLIST IDS
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).select("wishlist");
  res.send({ success: true, wishlist: user.wishlist });
};

