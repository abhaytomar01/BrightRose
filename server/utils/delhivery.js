import axios from "axios";
import { chargeableWeightKg } from "./weight.js";

export const calculateDelhiveryShipping = async ({ pincode, weightKg = 0.5, dims = {} }) => {
  try {
    // 1. Check pincode serviceability
    const r = await axios.get(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`,
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );

    const info = r.data?.delivery_codes?.[0];
    if (!info) return { serviceable: false };

    // 2. Calculate which weight Delhivery will charge
    const chargeable = chargeableWeightKg(
      { weightKg, dims },
      5000 // divisor for volumetric weight
    );

    // 3. Use ODA or NON-ODA pricing
    const baseRatePerKg = info.postal_code?.is_oda ? 120 : 80;

    // 4. Final shipping charge
    const shippingCharge = Math.ceil(chargeable * baseRatePerKg);

    return { serviceable: true, shippingCharge, info };
  } catch (err) {
    return {
      serviceable: false,
      shippingCharge: 0,
      error: err.message,
    };
  }
};
