// client/src/pages/user/Checkout/Checkout.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";

export default function Checkout() {

  const { cartItems = [], subtotal = 0, clearCart, country, setCountry } = useCart();
  const { authUser } = useAuth();
  const token = authUser?.token;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [checkingShipping, setCheckingShipping] = useState(false);

  const [address, setAddress] = useState({
    name: authUser?.user?.name || "",
    email: authUser?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [shippingCharge, setShippingCharge] = useState(0);
  const finalTotal = Number(subtotal) + Number(shippingCharge || 0);

  /* ================= COUNTRY DETECTION ================= */
  const detectCountry = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/geoip/detect`);
      if (res.data?.country) setCountry(res.data.country);
    } catch {}
  }, [setCountry]);

  useEffect(() => {
    detectCountry();
  }, [detectCountry]);

  /* ================= VALIDATION ================= */
  function validateStep1() {
    const { email, name, phone, address: street, city, state, pincode } = address;

    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }

    if (!name?.trim()) return toast.error("Full name required"), false;
    if (!phone?.trim() || !/^[0-9]{10}$/.test(phone))
      return toast.error("Enter 10-digit phone number"), false;

    if (!street?.trim()) return toast.error("Address is required"), false;
    if (!city?.trim()) return toast.error("City is required"), false;
    if (!state?.trim()) return toast.error("State is required"), false;

    if (country === "India") {
      if (!pincode?.trim() || !/^[0-9]{6}$/.test(pincode))
        return toast.error("Enter valid 6-digit PIN code"), false;
    }

    return true;
  }

  /* ================= SHIPPING ================= */
  async function fetchShippingCharge() {
    if (country === "India" && !address.pincode) {
      toast.info("Enter Pincode to calculate shipping");
      return;
    }

    setCheckingShipping(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/shipping/calculate`,
        {
          cartItems,
          country,
          pincode: address.pincode,
        }
      );

      if (res.data?.success) {
        setShippingCharge(res.data.amount);
      } else {
        toast.error("Failed to calculate shipping");
      }

    } catch {
      toast.error("Shipping service unavailable");
    }
    setCheckingShipping(false);
  }

  /* ================= RAZORPAY ================= */
  function loadRazorpay() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePayment() {
    try {
      if (!cartItems.length) return toast.error("Cart is empty");

      setPaymentProcessing(true);

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay load failed");
        setPaymentProcessing(false);
        return;
      }

      const finalAddress = { ...address, country: country || "India" };

      // Create Razorpay Order
      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        { amount: Math.round(finalTotal) },
        token && { headers: { Authorization: `Bearer ${token}` } }
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
          name: finalAddress.name,
          email: finalAddress.email,
          contact: finalAddress.phone,
        },

        handler: async function (response) {
          toast.info("Verifying payment...");

          const verifyRes = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              address: finalAddress,
              shippingCharge,
              total: finalTotal,
            },
            token && { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data?.success) {
            toast.success("Order placed successfully");
            clearCart();
            navigate("/order-success");
          } else {
            toast.error("Payment verification failed");
          }
        },

        theme: { color: "#000000" }
      });

      rzp.open();
    } catch {
      toast.error("Payment failed, try again");
    } finally {
      setPaymentProcessing(false);
    }
  }

  /* ================= STEP MANAGEMENT ================= */
  async function nextStep() {
    if (step === 1) {
      if (!validateStep1()) return;
      await fetchShippingCharge();
    }
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => s - 1);
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] mt-10 md:mt-20">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">

        {/* LEFT */}
        <div className="px-6 md:px-12 py-10 border-r border-gray-200">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-lg md:text-2xl font-semibold tracking-wide">
              Bright Rose
            </h1>

            <button onClick={() => navigate("/login")} className="text-sm underline">
              Sign in
            </button>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <section className="mb-10">
                <h2 className="text-md md:text-lg font-semibold mb-3">Contact</h2>

                <input
                  className="w-full border rounded-md p-3 mb-3"
                  placeholder="Email"
                  name="email"
                  value={address.email}
                  onChange={(e) =>
                    setAddress((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </section>

              <section>
                <h2 className="text-md md:text-lg font-semibold mb-4">Delivery</h2>

                <select
                  className="border p-3 text-sm rounded-md w-full mb-3"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>UAE</option>
                  <option>Singapore</option>
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="Full Name"
                    name="name"
                    value={address.name}
                    onChange={(e) =>
                      setAddress((s) => ({ ...s, name: e.target.value }))
                    }
                  />

                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="Phone"
                    name="phone"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress((s) => ({ ...s, phone: e.target.value }))
                    }
                  />
                </div>

                <input
                  className="border p-3 text-sm rounded-md w-full mt-3"
                  placeholder="Address"
                  name="address"
                  value={address.address}
                  onChange={(e) =>
                    setAddress((s) => ({ ...s, address: e.target.value }))
                  }
                />

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="City"
                    name="city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((s) => ({ ...s, city: e.target.value }))
                    }
                  />

                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="State"
                    name="state"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((s) => ({ ...s, state: e.target.value }))
                    }
                  />

                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="PIN Code"
                    name="pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress((s) => ({ ...s, pincode: e.target.value }))
                    }
                  />
                </div>

                <button
                  onClick={nextStep}
                  className="mt-6 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-md text-sm tracking-wide"
                >
                  Continue to Payment
                </button>
              </section>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-md md:text-lg font-semibold mb-4">Payment</h2>

              <p className="text-sm text-gray-500 mb-4">
                All transactions are secure and encrypted.
              </p>

              <div className="border rounded-md p-4 flex items-center gap-3">
                <input type="radio" checked readOnly />
                <span className="font-medium text-sm md:text-md">
                  Online Payment
                </span>
              </div>

              <div className="flex justify-between text-sm md:text-md mt-6">
                <button onClick={prevStep} className="text-sm underline">
                  Return to Information
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="bg-[#1a1a1a] text-white px-6 py-3 rounded-md"
                >
                  Review Order
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="text-md md:text-lg font-semibold mb-4">
                Review Order
              </h2>

              <div className="bg-white border rounded-md">
                {cartItems.map((i) => (
                  <div key={i._id} className="flex justify-between p-4 border-b">
                    <div className="flex gap-3">
                      <img src={i.image} className="w-14 h-14 object-cover rounded-md border" />
                      <div>
                        <p className="font-medium">{i.name}</p>
                        <p className="text-sm text-gray-500">Qty: {i.quantity}</p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ₹{((i.discountPrice || i.price) * i.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="mt-8 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-md tracking-wide"
              >
                {paymentProcessing
                  ? "Processing..."
                  : `Place Order ₹${finalTotal.toLocaleString()}`}
              </button>
            </>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-[#fafafa] px-6 md:px-10 py-10 sticky top-0 h-fit">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between mb-6">
              <div className="flex gap-3">
                <img src={item.image} className="w-16 h-16 object-cover rounded-md border" />
                <div>
                  <p className="font-medium text-sm md:text-md">{item.name}</p>
                </div>
              </div>

              <p className="font-semibold text-sm md:text-md">
                ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}

          <div className="border-t pt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCharge ? `₹${shippingCharge.toLocaleString()}` : "Calculated later"}
              </span>
            </div>

            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
