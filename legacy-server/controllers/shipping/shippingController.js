// server/controllers/shipping/shippingController.js
import axios from "axios";

export const calculateShipping = async (req, res) => {
  try {
    const { pincode, weightKg, dims } = req.body;

    if (!pincode || !weightKg) {
      return res.status(400).json({
        success: false,
        message: "Destination pincode and weight are required",
      });
    }

    const originPincode = process.env.BLUEDART_ORIGIN_PINCODE || "110020";
    const destPincode = pincode;

    // TODO: Replace this block with real Bluedart / APIGEE rate call
    // using your Username + Licence Key + Version + Customer Code.
    //
    // Example shape (pseudo):
    // const apiRes = await axios.post(process.env.BLUEDART_RATE_URL, {
    //   originPincode,
    //   destPincode,
    //   weightKg,
    //   dimensions: dims,
    //   loginId: process.env.BLUEDART_LOGIN,
    //   licenceKey: process.env.BLUEDART_LICENCE_KEY,
    //   customerCode: process.env.BLUEDART_CUSTOMER_CODE,
    //   version: process.env.BLUEDART_API_VERSION,
    // });

    // Basic volumetric + zone rule until live API is wired:
    const volWeight =
      ((dims?.l || 30) * (dims?.b || 20) * (dims?.h || 10)) / 5000;
    const billableWeight = Math.max(Number(weightKg), volWeight);

    let amount;
    if (destPincode.startsWith("11")) {
      amount = 80 + billableWeight * 20;
    } else if (
      destPincode.startsWith("4") ||
      destPincode.startsWith("5")
    ) {
      amount = 120 + billableWeight * 30;
    } else {
      amount = 100 + billableWeight * 25;
    }

    amount = Math.round(amount);

    return res.json({
      success: true,
      amount,
    });
  } catch (err) {
    console.error("Shipping error:", err);
    res.status(500).json({ success: false, message: "Shipping failed" });
  }
};
