import express from "express";
import { calculateDelhiveryShipping } from "../utils/delhivery.js";

const router = express.Router();

/**
 * PUBLIC — used during checkout
 */
router.post("/calculate", async (req, res) => {
  try {
    const { pincode, cartItems, country } = req.body;

    // Basic weight calculation
    const totalWeightKg =
      cartItems?.reduce((sum, item) => sum + (item.weightKg || 1), 0) || 1;

    if (country !== "India") {
      return res.json({
        success: true,
        amount: 5000, // flat international fallback
        provider: "flat",
      });
    }

    const shipping = await calculateDelhiveryShipping({
      pincode,
      weightKg: totalWeightKg,
    });

    return res.json({
      success: true,
      amount: shipping.amount,
      provider: "delhivery",
    });

  } catch (err) {
    console.error("Shipping error:", err);
    return res.status(500).json({
      success: false,
      message: "Shipping calculation failed",
    });
  }
});

export default router;
