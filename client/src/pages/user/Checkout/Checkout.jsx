// client/src/pages/user/Checkout/Checkout.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";

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

  const [billingInfo, setBillingInfo] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Delhi",
    pincode: "",
    phone: "",
  });

  const safeSubtotal = Number(subtotal || 0);
  const taxAmount = +(safeSubtotal * 0.1526).toFixed(2); // example GST ~15.26%
  const finalTotal = safeSubtotal + shippingCharge;

  /* ---------------- SHIPPING CALC ---------------- */
  const fetchShippingCharge = async () => {
    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.pincode ||
      !shippingInfo.phone
    ) {
      toast.error("Please fill all delivery details");
      return false;
    }

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
        setShippingCharge(Number(res.data.amount || 0));
        return true;
      } else {
        toast.error("Shipping calculation failed");
        return false;
      }
    } catch {
      toast.error("Shipping service unavailable");
      return false;
    } finally {
      setLoadingShipping(false);
    }
  };

  /* ---------------- RAZORPAY ---------------- */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const shippingOk = await fetchShippingCharge();
    if (!shippingOk) return;

    setPaymentProcessing(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return toast.error("Razorpay failed to load");

      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        {
          amount: Math.round(finalTotal),
          cartItems,
          shippingAddress: {
            ...shippingInfo,
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            phoneNo: shippingInfo.phone,
            shippingCharge,
            billingAddress: billingSameAsShipping
              ? shippingInfo
              : billingInfo,
          },
        },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      const { orderId, dbOrderId } = orderRes.data;

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: finalTotal * 100,
        currency: "INR",
        name: "Bright Rose",
        handler: async (response) => {
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
            { ...response, dbOrderId }
          );
          clearCart();
          navigate("/order-success");
        },
      });

      rzp.open();
    } catch {
      toast.error("Payment failed");
    } finally {
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
              <option>Delhi</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
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
              setShippingInfo({ ...shippingInfo, phone: e.target.value })
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
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          <div className="border rounded p-4 mb-6">
            Razorpay Secure (UPI, Cards, Wallets)
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentProcessing}
            className="w-full bg-blue-600 text-white py-4 rounded text-lg"
          >
            {paymentProcessing ? "Processing..." : "Pay now"}
          </button>

          {/* POLICIES */}
          <div className="text-sm text-gray-500 mt-6 space-x-3 mb-6">
            <Link to="/refund-policy" className="underline">Refund policy</Link>
            <Link to="/shipping-policy" className="underline">Shipping</Link>
            <Link to="/privacy-policy" className="underline">Privacy policy</Link>
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
