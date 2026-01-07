/* Luxury Shipping Page — Bright Rose (Industry Standard) */

import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import states from "../../../utils/states";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import SeoData from "../../../SEO/SeoData";
import PriceCard from "./PriceCard";

const Shipping = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { authUser } = useAuth();

  const stored = localStorage.getItem("shippingInfo");
  const saved = stored ? JSON.parse(stored) : {};

  const [form, setForm] = useState({
    address: saved.address || "",
    city: saved.city || "",
    state: saved.state || "",
    landmark: saved.landmark || "",
    pincode: saved.pincode || "",
    phoneNo: saved.phoneNo || "",
    country: "IN",
  });

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!form.address.trim()) return toast.error("Address required"), false;
    if (!form.city.trim()) return toast.error("City required"), false;
    if (!form.state) return toast.error("State required"), false;

    if (!/^[0-9]{6}$/.test(form.pincode))
      return toast.error("Enter valid 6-digit pincode"), false;

    if (!/^[0-9]{10}$/.test(form.phoneNo))
      return toast.error("Enter valid 10-digit phone number"), false;

    return true;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem("shippingInfo", JSON.stringify(form));

    toast.success("Shipping details saved");
    navigate("/checkout"); // 👉 move to checkout/payment page
  };

  return (
    <>
      <SeoData title="Shipping Details | Bright Rose" />

      <main className="w-full pt-32 md:pt-44 pb-10 bg-[#F8F6F3] font-[Manrope]">
        <div className="w-full sm:w-11/12 mx-auto flex flex-col sm:flex-row gap-6 px-4">

          {/* LEFT — SHIPPING FORM */}
          <div className="flex-1 bg-white rounded-2xl border border-[#e8e2d9] shadow-sm p-8">
            <h1 className="text-2xl font-semibold tracking-wide mb-6">
              Shipping Details
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

              <TextField
                label="Full Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                fullWidth
                required
              />

              <div className="flex gap-4">
                <TextField
                  label="Pincode"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value })
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Phone Number"
                  value={form.phoneNo}
                  onChange={(e) =>
                    setForm({ ...form, phoneNo: e.target.value })
                  }
                  fullWidth
                  required
                />
              </div>

              <div className="flex gap-4">
                <TextField
                  label="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Landmark (Optional)"
                  value={form.landmark}
                  onChange={(e) =>
                    setForm({ ...form, landmark: e.target.value })
                  }
                  fullWidth
                />
              </div>

              <div className="flex gap-4">
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select value="IN" disabled label="Country">
                    <MenuItem value="IN">India</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={form.state}
                    label="State"
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    required
                  >
                    {states.map((s) => (
                      <MenuItem key={s.code} value={s.code}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <button
                type="submit"
                className="
                  w-full sm:w-[50%] py-3.5 rounded-lg
                  bg-[#AD000F] hover:bg-[#8c000c]
                  text-white text-sm font-semibold tracking-wide
                "
              >
                Continue to Checkout
              </button>
            </form>
          </div>

          {/* RIGHT — PRICE CARD */}
          <PriceCard cartItems={cartItems} />
        </div>
      </main>
    </>
  );
};

export default Shipping;
