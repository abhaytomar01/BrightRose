import ShippingRate from "../../models/shippingRateModel.js";
import { calculateDelhiveryShipping } from "../../utils/delhivery.js";

export const calculateShipping = async (req, res) => {
  try {
    const { cartItems, country, pincode } = req.body;

    if (!cartItems?.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // -----------------------------
    // Calculate total weight
    // -----------------------------
    const weightKg =
      cartItems.reduce((sum, i) => sum + (i.weightKg || 0.5) * i.quantity, 0) || 0.5;

    // =============================
    // 🇮🇳 INDIA → DELHIVERY
    // =============================
    if (country === "India") {
      if (!pincode || pincode.length !== 6) {
        return res.status(400).json({
          success: false,
          message: "Valid pincode required",
        });
      }

      try {
        const delhivery = await calculateDelhiveryShipping({
          pincode,
          weightKg,
          dims: { l: 20, b: 15, h: 10 }, // default safe dims
        });

        return res.json({
          success: true,
          amount: delhivery.amount,
          provider: "Delhivery",
          eta: delhivery.eta,
        });
      } catch (err) {
        console.error("Delhivery failed:", err);
        // fallback continues
      }
    }

    // =============================
    // 🌍 INTERNATIONAL / FALLBACK
    // =============================
    const rate = await ShippingRate.findOne({ country });

    if (!rate) {
      return res.json({
        success: true,
        amount: 0,
        provider: "Free Shipping",
      });
    }

    return res.json({
      success: true,
      amount: rate.amount,
      provider: "Flat Rate",
      meta: rate.meta,
    });
  } catch (err) {
    console.error("Shipping error:", err);
    res.status(500).json({
      success: false,
      message: "Shipping calculation failed",
    });
  }
};
