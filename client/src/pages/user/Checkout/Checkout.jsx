// client/src/pages/user/Checkout/Checkout.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const safeSubtotal = Number(subtotal || 0);
  const safeShipping = Number(shippingCharge || 0);
  const finalTotal = safeSubtotal + safeShipping;

  // ---------------- SHIPPING ----------------
  const calculateShipping = async () => {
    if (
      !shippingInfo.name ||
      !shippingInfo.phoneNo ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.pincode
    ) {
      toast.error("Please fill delivery address");
      return;
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
      } else {
        toast.error("Shipping unavailable");
      }
    } catch {
      toast.error("Shipping service unavailable");
    } finally {
      setLoadingShipping(false);
    }
  };

  // ---------------- RAZORPAY ----------------
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePayment = async () => {
    if (!cartItems.length) {
      toast.error("Cart is empty");
      return;
    }

    await calculateShipping();
    if (!shippingCharge) return;

    setPaymentProcessing(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Payment failed to load");
        return;
      }

      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        {
          amount: Math.round(finalTotal),
          cartItems,
          shippingAddress: {
            ...shippingInfo,
            shippingCharge,
          },
        },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      const { orderId, dbOrderId } = orderRes.data;

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: finalTotal * 100,
        currency: "INR",
        name: "Bright Rose",
        description: "Secure Checkout",
        order_id: orderId,
        prefill: {
          name: shippingInfo.name,
          email: shippingInfo.email || authUser?.user?.email,
          contact: shippingInfo.phoneNo,
        },
        handler: async (response) => {
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
            {
              ...response,
              dbOrderId,
            }
          );

          toast.success("Order placed successfully");
          clearCart();
          navigate("/orders");
        },
        theme: { color: "#000000" },
      });

      rzp.open();
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="bg-white min-h-screen pt-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_420px] gap-12 px-4">

        {/* LEFT */}
        <div className="space-y-10">

          {/* CONTACT */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            <input
              className="w-full border rounded px-4 py-3"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, email: e.target.value })
              }
            />
          </section>

          {/* DELIVERY */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Delivery</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Full name"
                className="border px-4 py-3 rounded"
                value={shippingInfo.name}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, name: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="border px-4 py-3 rounded"
                value={shippingInfo.phoneNo}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phoneNo: e.target.value })
                }
              />
            </div>

            <textarea
              placeholder="Address"
              className="border px-4 py-3 rounded w-full mt-4"
              rows={3}
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
            />

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                placeholder="City"
                className="border px-4 py-3 rounded"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              />
              <input
                placeholder="State"
                className="border px-4 py-3 rounded"
                value={shippingInfo.state}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, state: e.target.value })
                }
              />
              <input
                placeholder="PIN code"
                className="border px-4 py-3 rounded"
                value={shippingInfo.pincode}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, pincode: e.target.value })
                }
              />
            </div>
          </section>

          {/* PAYMENT */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Payment</h2>
            <div className="border rounded p-4 flex items-center gap-3">
              <span className="font-medium">Razorpay Secure</span>
              <span className="text-sm text-gray-500">
                UPI, Cards, Wallets
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentProcessing}
              className="mt-6 w-full bg-black text-white py-4 rounded-lg text-lg"
            >
              {paymentProcessing
                ? "Processing..."
                : `Pay ₹${finalTotal.toLocaleString()}`}
            </button>
          </section>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-[#fafafa] p-6 rounded-lg h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Order summary</h3>

          {cartItems.map((i) => (
            <div key={i._id} className="flex justify-between text-sm mb-2">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>₹{(i.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{safeSubtotal}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>₹{safeShipping}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg mt-3">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
