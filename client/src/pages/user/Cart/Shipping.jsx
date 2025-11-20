/* Luxury Shipping Page — Bright Rose Edition */
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import states from "../../../utils/states";
import { toast } from "react-toastify";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import SeoData from "../../../SEO/SeoData";
import PriceCard from "./PriceCard";

const Shipping = () => {
  const Info = localStorage.getItem("shippingInfo");
  const shippingInfo = JSON.parse(Info);

  const [cartItems] = useCart();
  const { auth } = useAuth();

  const [address, setAddress] = useState(shippingInfo?.address);
  const [city, setCity] = useState(shippingInfo?.city);
  const [country] = useState("IN");
  const [state, setState] = useState(shippingInfo?.state);
  const [landmark, setLandmark] = useState(shippingInfo?.landmark);
  const [pincode, setPincode] = useState(shippingInfo?.pincode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo);

  const publishKey = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
  const frontendURL = window.location.origin;

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length !== 10) {
      toast.error("Invalid Mobile Number");
      return;
    }

    const data = {
      address,
      city,
      country,
      state,
      landmark,
      pincode,
      phoneNo,
    };

    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };

  const handlePayment = async () => {
    const stripe = await loadStripe(publishKey);

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-checkout-session`,
      {
        products: cartItems,
        frontendURL,
        customerEmail: auth?.user?.email,
      },
      {
        headers: { Authorization: auth?.token },
      }
    );

    const session = response.data.session;
    localStorage.setItem("sessionId", session.id);

    const result = stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) console.log(result.error);
  };

  return (
    <>
      <SeoData title="Bright Rose | Shipping Details" />

      <main
        className="w-full pt-32 md:pt-44 pb-10 bg-[#F8F6F3] font-[Manrope]"
      >
        <div className="w-full sm:w-11/12 mx-auto flex flex-col sm:flex-row gap-6 px-4">

          {/* LEFT — Shipping Form */}
          <div className="flex-1 bg-white rounded-2xl border border-[#e8e2d9] shadow-sm p-8">

            <h1 className="text-2xl font-semibold tracking-wide text-[#1a1a1a] mb-6">
              Shipping Details
            </h1>

            <form onSubmit={shippingSubmit} autoComplete="off" className="space-y-6">

              <TextField
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                label="Full Address"
                variant="outlined"
                required
              />

              <div className="flex gap-4 w-full">
                <TextField
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  type="number"
                  label="Pincode"
                  fullWidth
                  required
                />
                <TextField
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  type="number"
                  label="Phone Number"
                  fullWidth
                  required
                />
              </div>

              <div className="flex gap-4 w-full">
                <TextField
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  label="City"
                  fullWidth
                  required
                />

                <TextField
                  label="Landmark (Optional)"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="flex gap-4 w-full">
                <FormControl fullWidth>
                  <InputLabel id="country-select">Country</InputLabel>
                  <Select
                    labelId="country-select"
                    defaultValue={"IN"}
                    disabled
                    label="Country"
                  >
                    <MenuItem value="IN">India</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="state-select">State</InputLabel>
                  <Select
                    labelId="state-select"
                    value={state}
                    label="State"
                    onChange={(e) => setState(e.target.value)}
                    required
                  >
                    {states?.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <button
                type="submit"
                onClick={handlePayment}
                className="
                  w-full sm:w-[50%] py-3.5 rounded-lg text-white
                  bg-[#AD000F] hover:bg-[#8c000c] 
                  tracking-wide text-sm font-semibold
                  transition-all shadow-md
                "
              >
                Make Payment
              </button>
            </form>
          </div>

          {/* RIGHT — Price Card */}
          <PriceCard cartItems={cartItems} />
        </div>
      </main>
    </>
  );
};

export default Shipping;
