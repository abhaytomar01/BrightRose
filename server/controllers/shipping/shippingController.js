export const calculateShipping = async (req, res) => {
  try {
    const { country, pincode, cartItems } = req.body;

    let shipping = 0;

    // 🇮🇳 India logic
    if (country === "India") {
      shipping = cartItems.length > 0 ? 0 : 0; // Free shipping
    } else {
      shipping = 500; // International flat
    }

    return res.json({
      success: true,
      amount: shipping,
    });
  } catch (err) {
    console.error("Shipping error:", err);
    res.status(500).json({ success: false });
  }
};
