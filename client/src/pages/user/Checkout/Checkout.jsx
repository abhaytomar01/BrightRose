// client/src/pages/user/Checkout/Checkout.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import Spinner from "../../../components/Spinner";

// Fallback international shipping table (keeps your values)
const INTERNATIONAL_SHIPPING_TABLE = {
  USA: 6500,
  Canada: 6200,
  Australia: 7000,
  UK: 5800,
  Germany: 6000,
  France: 5900,
  UAE: 3500,
  Singapore: 4000,
  Malaysia: 3800,
  Japan: 6500,
  Default: 5000,
};

const Checkout = () => {
  const {
    cartItems = [],
    subtotal = 0,
    tax = 0,
    grandTotal = 0, // your context provided grandTotal (without shipping?), keep using subtotal calculations below
    clearCart,
    country,
    setCountry,
  } = useCart();

  const { authUser } = useAuth();
  const token = authUser?.token;

  const navigate = useNavigate();

  // Steps & UI
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [checkingShipping, setCheckingShipping] = useState(false);

  // Address state
  const [address, setAddress] = useState({
    name: authUser?.user?.name || "",
    email: authUser?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Shipping
  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingSource, setShippingSource] = useState("");

  // Helper to update address fields
  const updateAddress = (e) =>
    setAddress((s) => ({ ...s, [e.target.name]: e.target.value }));

  // GeoIP detect country (best-effort)
  const detectCountry = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/geoip/detect`
      );
      if (res.data?.country) setCountry(res.data.country);
    } catch (err) {
      // silent failure — fallback will be used
      console.warn("GeoIP detect failed", err?.message || err);
    }
  }, [setCountry]);

  useEffect(() => {
    detectCountry();
  }, [detectCountry]);

  // ---------- Shipping Calculators ----------
  const fetchDomesticShipping = async (pincode) => {
    setCheckingShipping(true);
    try {
      // estimate weight from cart - fallback 0.5kg per item if rawProduct missing
      const weightKg =
        cartItems.reduce(
          (s, it) => s + (it.rawProduct?.weightKg || 0.5) * (it.quantity || 1),
          0
        ) || 0.5;

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/shipping/delhivery`,
        { pincode, weightKg }
      );

      if (res.data?.serviceable) {
        setShippingCharge(Number(res.data.shippingCharge || 0));
        setShippingSource("delhivery");
        toast.success(`Shipping ₹${res.data.shippingCharge} (Domestic)`);
      } else {
        setShippingCharge(0);
        setShippingSource("unserviceable");
        toast.error("Delivery not available to this pincode.");
      }
    } catch (err) {
      console.error("Delhivery error:", err);
      setShippingSource("error");
      toast.error("Unable to fetch Delhivery shipping. Using fallback.");
    } finally {
      setCheckingShipping(false);
    }
  };

  const fetchInternationalShipping = async (countryName) => {
    setCheckingShipping(true);
    try {
      // 1) Try admin-set rates endpoint
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/shipping/rate/${encodeURIComponent(
            countryName
          )}`
        );
        if (res.data?.success && typeof res.data.rate === "number") {
          setShippingCharge(Number(res.data.rate));
          setShippingSource("admin");
          toast.success(`Shipping ₹${res.data.rate} for ${countryName}`);
          setCheckingShipping(false);
          return;
        }
      } catch (_) {
        // ignore, fallbacks below
      }

      // 2) Fallback table
      const foundKey = Object.keys(INTERNATIONAL_SHIPPING_TABLE).find(
        (k) => k.toLowerCase() === (countryName || "").toLowerCase()
      );
      const fallbackRate = foundKey
        ? INTERNATIONAL_SHIPPING_TABLE[foundKey]
        : INTERNATIONAL_SHIPPING_TABLE.Default;

      setShippingCharge(fallbackRate);
      setShippingSource("fallback");
      toast.info(`International shipping estimated ₹${fallbackRate}`);
    } catch (err) {
      console.error("International shipping error:", err);
      setShippingCharge(INTERNATIONAL_SHIPPING_TABLE.Default);
      setShippingSource("fallback");
    } finally {
      setCheckingShipping(false);
    }
  };

  // Master shipping calc
  const calculateShipping = async () => {
    if (!cartItems.length) {
      setShippingCharge(0);
      return;
    }

    if (!country || country.toLowerCase() === "india") {
      if (!address.pincode || address.pincode.toString().length !== 6) {
        toast.info("Enter 6-digit pincode to calculate shipping");
        return;
      }
      await fetchDomesticShipping(address.pincode);
    } else {
      await fetchInternationalShipping(country);
    }
  };

  // Recalc on country changes or valid pincode
  useEffect(() => {
    if (!country) return;
    if (country.toLowerCase() === "india") {
      if (address.pincode && address.pincode.toString().length === 6) {
        calculateShipping();
      }
    } else {
      calculateShipping();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  // ---------- Razorpay script loader ----------
  const loadRazorpayScript = (src = "https://checkout.razorpay.com/v1/checkout.js") =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ---------- Payment flow ----------
  const handleRazorpay = async () => {
    // basic checks
    if (!token) {
      toast.error("Please login to complete order");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      toast.error("Cart is empty");
      return;
    }

    // shipping validation for India
    if ((country || "India").toLowerCase() === "india") {
      if (!address.pincode || address.pincode.toString().length !== 6) {
        toast.error("Enter valid 6-digit pincode");
        return;
      }
      if (shippingSource === "unserviceable") {
        toast.error("Delivery not available to this pincode");
        return;
      }
    } else {
      if (!shippingCharge) {
        toast.info("Calculating shipping…");
        await calculateShipping();
      }
    }

    // Merge country into address object (per your confirmation)
    const finalAddress = { ...address, country: country || "India" };

    // Mock payment mode (for testing)
    if (import.meta.env.VITE_MOCK_PAYMENT === "true") {
      try {
        setPaymentProcessing(true);
        const mockVerify = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
          {
            razorpay_order_id: "mock_order_001",
            razorpay_payment_id: "mock_payment_001",
            razorpay_signature: "mock_signature_001",
            cartItems,
            address: finalAddress,
            shippingCharge,
            total: Number(subtotal) + Number(shippingCharge),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (mockVerify.data.success) {
          toast.success("Mock Payment Successful!");
          clearCart();
          navigate("/user/orders");
        } else {
          toast.error("Mock verification failed");
        }
      } catch (err) {
        console.error("Mock payment error:", err);
        toast.error("Mock payment error");
      } finally {
        setPaymentProcessing(false);
      }
      return;
    }

    // Real Razorpay flow
    setPaymentProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay");
        setPaymentProcessing(false);
        return;
      }

      // Compute final total (subtotal + shipping). Tax is already included in subtotal if you use that model.
      const finalTotal = Number(subtotal) + Number(shippingCharge || 0);

      // Create order on backend (backend expects amount in rupees)
      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        { amount: Math.round(finalTotal) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderRes?.data?.success) {
        toast.error("Payment order creation failed");
        setPaymentProcessing(false);
        return;
      }

      const { orderId, amount, currency } = orderRes.data;

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount, // paise or amount returned by backend (backend returns paise value in example)
        currency: currency || "INR",
        name: "Bright Rose",
        description: "Order Payment",
        order_id: orderId,
        prefill: {
          name: finalAddress.name || "",
          email: finalAddress.email || "",
          contact: finalAddress.phone || "",
        },
        notes: { shippingSource },
        theme: { color: "#AD000F" },
        handler: async function (response) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          toast.info("Verifying payment...");
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems,
                address: finalAddress,
                shippingCharge,
                total: finalTotal,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success("Payment verified & Order created");
              clearCart();
              navigate("/user/orders");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verify payment error:", err);
            toast.error("Payment verification error");
          } finally {
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.warn("Payment cancelled");
            setPaymentProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
        setPaymentProcessing(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay init error:", err);
      toast.error("Payment initiation failed");
      setPaymentProcessing(false);
    }
  };

  // ---------- Steps Navigation ----------
  const nextStep = async () => {
    if (step === 1) {
      // basic validation of required address fields
      if (!address.name?.trim() || !address.address?.trim() || !address.city?.trim()) {
        toast.error("Please fill required address fields (name, address, city)");
        return;
      }

      if ((country || "India").toLowerCase() === "india") {
        if (!address.pincode || address.pincode.toString().length !== 6) {
          toast.error("Enter valid 6-digit pincode");
          return;
        }
      }

      await calculateShipping();
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // Final total (subtotal + shipping)
  const finalTotal = Number(subtotal) + Number(shippingCharge || 0);

  // Render
  return (
    <div className="min-h-screen bg-[#F8F6F3] py-12 px-4 md:px-10 font-[Manrope] mt-28 md:mt-40 flex justify-center">
      <div className="w-full max-w-5xl bg-white border border-[#e8e2d9] shadow-lg rounded-3xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-wide">
          Checkout
        </h1>
        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#D4AF37] to-transparent mb-8"></div>

        {/* Progress */}
        <div className="flex justify-between mb-8 relative">
          {["Address", "Payment", "Review"].map((label, idx) => {
            const active = step === idx + 1;
            const completed = step > idx + 1;
            return (
              <div key={label} className="flex flex-col items-center w-1/3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-semibold
                    ${active ? "bg-[#AD000F] text-white" : completed ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm">{label}</span>
              </div>
            );
          })}
          <div className="absolute top-5 left-[16%] right-[16%] h-[2px] bg-gray-200 -z-10"></div>
        </div>

        {/* STEP 1 — ADDRESS */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "name", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
              { name: "address", label: "Address" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "pincode", label: "Pincode" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">{field.label}</label>
                <input
                  name={field.name}
                  value={address[field.name]}
                  onChange={updateAddress}
                  placeholder={field.label}
                  className="border p-2 rounded-lg"
                />
              </div>
            ))}

            <div className="sm:col-span-2 flex items-center justify-end mt-4">
              <button onClick={nextStep} className="bg-[#AD000F] text-white px-5 py-3 rounded-lg">
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — PAYMENT */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Payment</h2>
            <p className="text-gray-600 text-sm">Secure Online Payment</p>

            <div className="border p-4 rounded-lg flex items-center gap-3">
              <input type="radio" checked readOnly />
              <span className="font-medium">Pay via Razorpay</span>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="border px-4 py-2 rounded-lg">
                Back
              </button>

              <button onClick={() => setStep(3)} className="bg-[#AD000F] text-white px-5 py-3 rounded-lg">
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — REVIEW */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            {/* Items */}
            <div className="border rounded-lg bg-white">
              {cartItems.map((item) => (
                <div key={item.key || item._id} className="p-4 flex justify-between items-center border-b last:border-b-0">
                  <div className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded border" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping {checkingShipping ? "(Checking…)" : ""}</span>
                <span>
                  {shippingSource === "unserviceable" ? "Unavailable" : shippingCharge ? `₹${shippingCharge.toLocaleString()}` : "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax (GST Included)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Pay Button */}
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="border px-4 py-2 rounded-lg">
                Back
              </button>

              <button
                onClick={handleRazorpay}
                disabled={paymentProcessing}
                className="bg-[#AD000F] text-white px-6 py-3 rounded-lg disabled:opacity-60"
              >
                {paymentProcessing ? "Processing..." : `Pay ₹${finalTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-8">After successful payment, an invoice will be sent to your email.</p>
      </div>
    </div>
  );
};

export default Checkout;
