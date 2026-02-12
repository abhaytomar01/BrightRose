// client/src/pages/user/Checkout/Checkout.jsx

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import upi from "../../../assets/images/upi.svg";
import visa from "../../../assets/images/visa.svg";
import mastercard from "../../../assets/images/master.svg";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { authUser } = useAuth();

  const token = authUser?.token;

  const [shippingCharge, setShippingCharge] = useState(0);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    email: authUser?.user?.email || "",
    address: "",
    apartment: "",
    city: "",
    state: "Delhi",
    pincode: "",
    phone: "",
  });

  const safeSubtotal = Number(subtotal || 0);
  const finalTotal = safeSubtotal + shippingCharge;

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "pincode",
      "phone",
      "email",
    ];

    for (let field of requiredFields) {
      if (!shippingInfo[field]) {
        toast.error("Please fill all delivery details");
        return false;
      }
    }

    if (shippingInfo.phone.length < 8) {
      toast.error("Enter valid phone number");
      return false;
    }

    return true;
  };

  /* ---------------- SHIPPING ---------------- */

  const fetchShippingCharge = async () => {
    setLoadingShipping(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/shipping/delhivery`,
        {
          pincode: shippingInfo.pincode,
          weightKg: cartItems.reduce(
            (w, i) => w + Number(i.quantity || 0) * 0.5,
            0.5
          ),
          dims: { l: 30, b: 20, h: 10 },
        }
      );

      if (res.data?.success) {
        const amount = Number(res.data.amount || 0);
        setShippingCharge(amount);
        return amount;
      }

      toast.error("Shipping calculation failed");
      return null;
    } catch {
      toast.error("Shipping service unavailable");
      return null;
    } finally {
      setLoadingShipping(false);
    }
  };

  /* ---------------- LOAD RAZORPAY ---------------- */

  const loadRazorpay = () =>
  new Promise((resolve) => {

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("razorpay-script");

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });


  /* ---------------- PAYMENT ---------------- */

 const handlePayment = async () => {

  if (paymentProcessing) {
    toast.info("Payment already in progress...");
    return;
  }

  if (!validateForm()) return;

  setPaymentProcessing(true);

  try {

    /* ---------- GET SHIPPING ---------- */

    let shippingAmount = shippingCharge;

    if (!shippingAmount) {
      shippingAmount = await fetchShippingCharge();
    }

    if (shippingAmount === null) {
      setPaymentProcessing(false);
      return;
    }

    const payableAmount = safeSubtotal + shippingAmount;

    /* ---------- LOAD RAZORPAY ---------- */

    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay SDK failed");

    /* ---------- CREATE CONFIG (OPTIONAL TOKEN) ---------- */

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}; // ✅ guest allowed

    /* ---------- CREATE ORDER ---------- */

    const orderRes = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
      {
        amount: Math.round(payableAmount),
        cartItems,
        isGuest: !token, // ⭐ VERY IMPORTANT (backend can track guest)
        shippingAddress: {
          ...shippingInfo,
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          phoneNo: shippingInfo.phone.replace(/\D/g, ""), // sanitize
          shippingCharge: shippingAmount,
        },
      },
      config
    );

    const { orderId, dbOrderId } = orderRes.data;

    /* ---------- OPEN RAZORPAY ---------- */

    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: orderId,
      amount: payableAmount * 100,
      currency: "INR",
      name: "Bright Rose",

      handler: async (response) => {

        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
          { ...response, dbOrderId }
        );

        clearCart();

        toast.success("Payment successful 🎉");

        navigate("/order-success");
      },

      modal: {
        ondismiss: () => {
          setPaymentProcessing(false);
        },
      },
    });

    rzp.open();

  } catch (err) {

    console.error("Payment Error:", err?.response?.data || err);

    if (err?.response?.status === 401) {

      // This should NOT happen after backend fix
      toast.error("Checkout unavailable. Please try again.");

    } else if (err?.response?.data?.message) {

      toast.error(err.response.data.message);

    } else {

      toast.error("Payment failed. Please try again.");
    }

    setPaymentProcessing(false);
  }
};



  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-white mt-10 md:mt-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 px-4">

        {/* LEFT */}
        <div>
          <h1 className="text-xl font-semibold mb-6">Contact</h1>
          {!authUser && (
            <p className="text-sm mb-4">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </p>
          )}

          <input
            className="border w-full px-3 py-3 mb-6 rounded"
            placeholder="Email"
            value={shippingInfo.email}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, email: e.target.value })
            }
          />

          {/* DELIVERY */}
          <h2 className="text-lg font-semibold mb-4">Delivery</h2>

          <select className="border w-full px-3 py-3 mb-4 rounded">
         <option>India</option>
<option>United States</option>
<option>United Kingdom</option>
<option>Australia</option>
<option>Canada</option>
<option>New Zealand</option>
<option>Singapore</option>
<option>United Arab Emirates</option>
<option>Saudi Arabia</option>
<option>Germany</option>
<option>France</option>
<option>Netherlands</option>
<option>Italy</option>
<option>Spain</option>
<option>Switzerland</option>
<option>Sweden</option>
<option>Norway</option>
<option>Denmark</option>
<option>Ireland</option>
<option>South Africa</option>
<option>Japan</option>
<option>South Korea</option>
<option>China</option>
<option>Malaysia</option>
<option>Thailand</option>
<option>Indonesia</option>
<option>Philippines</option>
<option>Brazil</option>
<option>Mexico</option>
<option>Turkey</option>

          </select>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              className="border px-3 py-3 rounded"
              placeholder="First name"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, firstName: e.target.value })
              }
            />
            <input
              className="border px-3 py-3 rounded"
              placeholder="Last name"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, lastName: e.target.value })
              }
            />
          </div>

          <input
            className="border w-full px-3 py-3 mb-4 rounded"
            placeholder="Address"
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, address: e.target.value })
            }
          />

          <input
            className="border w-full px-3 py-3 mb-4 rounded"
            placeholder="Apartment, suite, etc. (optional)"
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, apartment: e.target.value })
            }
          />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              className="border px-3 py-3 rounded"
              placeholder="City"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, city: e.target.value })
              }
            />
            <select
              className="border px-3 py-3 rounded"
              value={shippingInfo.state}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, state: e.target.value })
              }
            >
              <option>Andhra Pradesh</option>
<option>Arunachal Pradesh</option>
<option>Assam</option>
<option>Bihar</option>
<option>Chhattisgarh</option>
<option>Goa</option>
<option>Gujarat</option>
<option>Haryana</option>
<option>Himachal Pradesh</option>
<option>Jharkhand</option>
<option>Karnataka</option>
<option>Kerala</option>
<option>Madhya Pradesh</option>
<option>Maharashtra</option>
<option>Manipur</option>
<option>Meghalaya</option>
<option>Mizoram</option>
<option>Nagaland</option>
<option>Odisha</option>
<option>Punjab</option>
<option>Rajasthan</option>
<option>Sikkim</option>
<option>Tamil Nadu</option>
<option>Telangana</option>
<option>Tripura</option>
<option>Uttar Pradesh</option>
<option>Uttarakhand</option>
<option>West Bengal</option>

            </select>
            <input
              className="border px-3 py-3 rounded"
              placeholder="PIN code"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, pincode: e.target.value })
              }
            />
          </div>

          <input
            className="border w-full px-3 py-3 mb-6 rounded"
            placeholder="Phone"
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo,phone: e.target.value.replace(/\D/g, "")
 })
            }
          />

          {/* BILLING */}
          <h2 className="text-lg font-semibold mb-4">Billing address</h2>

          <label className="flex items-center gap-3 mb-2">
            <input
              type="radio"
              checked={billingSameAsShipping}
              onChange={() => setBillingSameAsShipping(true)}
            />
            Same as shipping address
          </label>

          <label className="flex items-center gap-3 mb-4">
            <input
              type="radio"
              checked={!billingSameAsShipping}
              onChange={() => setBillingSameAsShipping(false)}
            />
            Use a different billing address
          </label>

          {!billingSameAsShipping && (
            <div className="border rounded-lg p-4 mb-6 space-y-4 bg-gray-50">
              <input className="border w-full px-3 py-2 rounded" placeholder="Address" />
              <input className="border w-full px-3 py-2 rounded" placeholder="Apartment, suite" />
              <div className="grid grid-cols-3 gap-3">
                <input className="border px-3 py-2 rounded" placeholder="City" />
                <input className="border px-3 py-2 rounded" placeholder="State" />
                <input className="border px-3 py-2 rounded" placeholder="PIN" />
              </div>
              <input className="border w-full px-3 py-2 rounded" placeholder="Phone (optional)" />
            </div>
          )}

          {/* PAYMENT */}
          {/* PAYMENT */}
<h2 className="text-lg font-semibold mb-2">Payment</h2>
console.log("AUTH USER:", authUser);
console.log("TOKEN:", token);
          
<p className="text-sm text-gray-500 mb-3">
  All transactions are secure and encrypted.
</p>

<div className="border border-blue-600 rounded-lg overflow-hidden mb-6">
  <div className="flex items-center justify-between p-4 bg-blue-50">
    <span className="text-sm font-medium">
      Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)
    </span>

    <div className="flex items-center gap-2">
      <img src={upi} alt="UPI" className="h-5" />
      <img src={visa} alt="Visa" className="h-5" />
      <img src={mastercard} alt="Mastercard" className="h-5" />
      <span className="text-xs border px-2 py-0.5 rounded">+17</span>
    </div>
  </div>

  <div className="p-4 text-sm text-gray-600 bg-white">
    You'll be redirected to Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)
    to complete your purchase.
  </div>
   <button
            onClick={handlePayment}
            disabled={paymentProcessing}
            className="w-full bg-blue-600 text-white py-4 rounded text-lg"
          >
            {paymentProcessing ? "Processing..." : "Pay now"}
          </button>
</div>


          {/* POLICIES */}
          <div className="text-sm text-gray-500 mt-6 space-x-3 mb-6">
            <Link to="/exchange-return" className="underline">Exchange/Return policy</Link>
            <Link to="/exchange-return" className="underline">Shipping</Link>
            <Link to="/privacy" className="underline">Privacy policy</Link>
            <Link to="/terms" className="underline">Terms of service</Link>
            <Link to="/contact" className="underline">Contact</Link>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-24">
          {cartItems.map((i) => (
            <div key={i._id} className="flex gap-4 mb-4">
              <img src={i.image} className="w-16 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium">{i.name}</p>
                <p className="text-sm text-gray-500">{i.size}</p>
              </div>
              <p>₹{i.price * i.quantity}</p>
            </div>
          ))}

          <div className="flex gap-2 my-4">
            <input className="border flex-1 px-3 py-2 rounded" placeholder="Gift card" />
            <button className="border px-4 rounded">Apply</button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{safeSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCharge ? `₹${shippingCharge}` : "Enter shipping address"}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
            {/* <p className="text-xs text-gray-500">
              Including ₹{taxAmount} in taxes
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
