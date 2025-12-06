import express from "express";
import { calculateDelhiveryShipping } from "../utils/delhivery.js";

const router = express.Router();

router.post("/delhivery", async (req, res) => {
  try {
    const { pincode, weightKg, dims } = req.body;

    const shipping = await calculateDelhiveryShipping({
      pincode,
      weightKg,
      dims,
    });

    return res.json({ success: true, ...shipping });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Shipping error" });
  }
});

export default router;
