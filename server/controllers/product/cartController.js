import Cart from "../../models/cartModel.js";
import Product from "../../models/productModel.js";

// ✅ Add product to cart
export const addToCart = async (req, res) => {
  try {
    // If you’re using auth middleware, userId should come from req.user
    const userId = req.user?.id || req.body.userId;
    const { productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find if this product already exists in user's cart
    let cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      // Increment quantity if already exists
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Otherwise create new entry
      cartItem = await Cart.create({
        user: userId,
        product: productId,
        quantity,
      });
    }

    // Return full updated cart (optional, for better UX)
    const userCart = await Cart.find({ user: userId }).populate("product");

    res.status(200).json({
      message: "Added to cart successfully",
      cart: userCart,
    });
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user’s cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const cartItems = await Cart.find({ user: userId }).populate("product");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ message: "Quantity must be >= 1" });

    const item = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    ).populate("product");

    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove single item
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clear full cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    await Cart.deleteMany({ user: userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
