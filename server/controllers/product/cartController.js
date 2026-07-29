import Cart from "../../models/cartModel.js";

// GET /api/v1/cart/my-cart
export const getMyCart = async (req, res) => {
  try {
    const items = await Cart.find({ user: req.user._id }).populate("product");
    const cartItems = items.map((doc) => ({
      key: doc._id.toString(),
      productId: doc.product._id.toString(),
      name: doc.product.name,
      image: doc.product.images?.[0]?.url,
      price: doc.product.price,
      discountPrice: doc.product.discountPrice,
      quantity: doc.quantity,
      size: doc.size,
    }));
    res.json({ success: true, cartItems });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load cart" });
  }
};

// POST /api/v1/cart/add
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    let item = await Cart.findOne({ user: req.user._id, product: productId, size });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity,
        size,
      });
    }
    res.json({ success: true, itemId: item._id });
  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
};

// PUT /api/v1/cart/update/:id
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await Cart.deleteOne({ _id: req.params.id, user: req.user._id });
      return res.json({ success: true, removed: true });
    }
    const item = await Cart.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { quantity },
      { new: true }
    );
    res.json({ success: true, item });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};

// DELETE /api/v1/cart/remove/:id
export const removeCartItem = async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to remove item" });
  }
};

// DELETE /api/v1/cart/clear
export const clearMyCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};
