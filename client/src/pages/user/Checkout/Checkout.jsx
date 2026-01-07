// client/src/pages/user/Checkout/Checkout.jsx
import React, { useEffect, useState } from "react";
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

  const [step, setStep] = useState(1);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  /* ----------------------------------
     SHIPPING INFO (FROM Shipping.jsx)
  ---------------------------------- */
  const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));

  useEffect(() => {
    if (!shippingInfo) {
      toast.error("Please enter shipping details first");
      navigate("/shipping");
    }
  }, [navigate, shippingInfo]);

  /* ----------------------------------
     TOTAL
  ---------------------------------- */
  const finalTotal = Number(subtotal) + Number(shippingCharge || 0);

  /* ----------------------------------
     SHIPPING CALCULATION (DELHIVERY)
  ---------------------------------- */
  const fetchShippingCharge = async () => {
    if (!shippingInfo?.pincode) {
      toast.error("Shipping pincode missing");
      return;
    }

    setLoadingShipping(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/shipping/delhivery`,
        {
          pincode: shippingInfo.pincode,
          weightKg: cartItems.reduce(
            (w, i) => w + i.quantity * 0.5,
            0.5
          ),
          dims: { l: 30, b: 20, h: 10 },
        }
      );

      if (res.data?.success) {
        setShippingCharge(res.data.amount);
      } else {
        toast.error("Failed to calculate shipping");
      }
    } catch {
      toast.error("Shipping service unavailable");
    } finally {
      setLoadingShipping(false);
    }
  };

  /* ----------------------------------
     RAZORPAY LOADER
  ---------------------------------- */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ----------------------------------
     PAYMENT HANDLER
  ---------------------------------- */
  const handlePayment = async () => {
    if (!cartItems.length) return toast.error("Cart is empty");

    setPaymentProcessing(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay failed to load");
        return;
      }

      const authConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      /* CREATE ORDER */
      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        { amount: Math.round(finalTotal) }, // rupees
        authConfig
      );

      const { orderId, currency } = orderRes.data;

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: finalTotal * 100,
        currency: currency || "INR",
        name: "Bright Rose",
        description: "Order Payment",
        order_id: orderId,

        prefill: {
          name: authUser?.user?.name || "",
          email: authUser?.user?.email || "",
          contact: shippingInfo.phoneNo,
        },

        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cartItems,
                address: shippingInfo,
                shippingCharge,
                total: finalTotal,
              },
              authConfig
            );

            if (verifyRes.data?.success) {
              toast.success("Order placed successfully");
              clearCart();
              localStorage.removeItem("shippingInfo");
              navigate("/order-success");
            } else {
              toast.error("Payment verification failed");
            }
          } catch {
            toast.error("Payment verification error");
          }
        },

        theme: { color: "#000000" },
      });

      rzp.open();
    } catch {
      toast.error("Payment failed");
    } finally {
      setPaymentProcessing(false);
    }
  };

  /* ----------------------------------
     STEP CONTROL
  ---------------------------------- */
  const nextStep = async () => {
    if (step === 1) await fetchShippingCharge();
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  /* ----------------------------------
     UI
  ---------------------------------- */
  return (
    <div className="min-h-screen bg-[#fafafa] mt-10 md:mt-20">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">

        {/* LEFT */}
        <div className="px-6 md:px-12 py-10 border-r">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Shipping</h2>

              <div className="bg-white border rounded-md p-4 text-sm">
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.state}</p>
                <p>{shippingInfo.pincode}</p>
                <p>{shippingInfo.phoneNo}</p>
              </div>

              <button
                onClick={nextStep}
                disabled={loadingShipping}
                className="mt-6 w-full bg-black text-white py-4 rounded-md"
              >
                {loadingShipping ? "Calculating Shipping..." : "Continue"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Payment</h2>

              <div className="border rounded-md p-4 mb-6">
                Online Payment (Razorpay)
              </div>

              <div className="flex justify-between">
                <button onClick={prevStep} className="underline text-sm">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-black text-white px-6 py-3 rounded-md"
                >
                  Review Order
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Review Order</h2>

              {cartItems.map((i) => (
                <div key={i.key} className="flex justify-between py-3 border-b">
                  <span>{i.name} × {i.quantity}</span>
                  <span>
                    ₹{((i.discountPrice || i.price) * i.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className={`mt-8 w-full py-4 rounded-md text-white
                  ${paymentProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-900"}
                `}
              >
                {paymentProcessing
                  ? "Processing..."
                  : `Place Order ₹${finalTotal.toLocaleString()}`}
              </button>
            </>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="px-6 md:px-10 py-10 sticky top-0 h-fit">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
