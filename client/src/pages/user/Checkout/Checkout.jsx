// client/src/pages/user/Checkout/Checkout.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";

const Checkout = () => {
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

  const updateAddress = (e) => setAddress((s) => ({ ...s, [e.target.name]: e.target.value }));

  /* ---------------- GEO COUNTRY ---------------- */
  const detectCountry = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/geoip/detect`);
      if (res.data?.country) setCountry(res.data.country);
    } catch {}
  }, [setCountry]);

  useEffect(() => {
    detectCountry();
  }, [detectCountry]);

  /* ---------------- SHIPPING CALC VIA BACKEND ---------------- */
  const fetchShippingCharge = async () => {
    if (!address.pincode && country === "India") {
      toast.info("Enter Pincode");
      return;
    }

    setCheckingShipping(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/shipping/calculate`, {
        cartItems,
        country,
        pincode: address.pincode,
      });

      if (res.data.success) {
        setShippingCharge(res.data.amount);
        toast.success("Shipping Updated");
      } else toast.error("Shipping Error");
    } catch {
      toast.error("Shipping Failed");
    }
    setCheckingShipping(false);
  };

  const finalTotal = Number(subtotal) + Number(shippingCharge || 0);

  /* ---------------- LOAD RAZORPAY SCRIPT ---------------- */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ---------------- HANDLE PAYMENT ---------------- */
  const handlePayment = async () => {
    try {
      if (!cartItems.length) return toast.error("Cart Empty");

      setPaymentProcessing(true);
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay Load Failed");
        setPaymentProcessing(false);
        return;
      }

      const finalAddress = { ...address, country: country || "India" };

      // 1️⃣ Create Razorpay Order
      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        {
          amount: Math.round(finalTotal),
        },
        token && { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, currency } = orderRes.data;

      // 2️⃣ Open Razorpay Checkout
      const options = {
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
          toast.info("Verifying Payment...");

          // 3️⃣ Verify Payment + Create Order in DB
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

          if (verifyRes.data.success) {
            toast.success("Order Successful");
            clearCart();
            navigate("/order-success");
          } else toast.error("Payment Failed");
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment Error");
    } finally {
      setPaymentProcessing(false);
    }
  };

  function validateStep1Fields() {
  const { email, name, phone, address, city, state, pincode } = address;

  if (!email?.trim() ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      !name?.trim() ||
      !phone?.trim() ||
      !/^[0-9]{10}$/.test(phone) ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim()
  ) {
    toast.error("Fill all required fields correctly");
    return false;
  }

  if (country === "India") {
    if (!pincode?.trim() || !/^[0-9]{6}$/.test(pincode)) {
      toast.error("Enter a valid 6-digit PIN Code");
      return false;
    }
  }

  return true;
}



  /* ---------------- STEP HANDLING ---------------- */
  async function nextStep() {
  if (step === 1) {
    const valid = validateStep1Fields();
    if (!valid) return;

    await fetchShippingCharge();
  }
  setStep(s => s + 1);
}



  function prevStep() {
  setStep(s => s - 1);
}


  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] mt-10 md:mt-20">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* LEFT SIDE */}
        <div className="px-6 md:px-12 py-10 border-r border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-lg md:text-2xl font-semibold tracking-wide">
              Bright Rose
            </h1>

            <button
              onClick={() => navigate("/login")}
              className="text-sm underline"
            >
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
                  placeholder="Email or phone number"
                  name="email"
                  value={address.email}
                  onChange={updateAddress}
                />

                <label className="flex gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  Email me with news and offers
                </label>
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
                    onChange={updateAddress}
                  />

                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="Phone"
                    name="phone"
                    value={address.phone}
                    onChange={updateAddress}
                  />
                </div>

                <input
                  className="border p-3 text-sm rounded-md w-full mt-3"
                  placeholder="Address"
                  name="address"
                  value={address.address}
                  onChange={updateAddress}
                />

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="City"
                    name="city"
                    value={address.city}
                    onChange={updateAddress}
                  />
                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="State"
                    name="state"
                    value={address.state}
                    onChange={updateAddress}
                  />
                  <input
                    className="border p-3 text-sm rounded-md"
                    placeholder="PIN code"
                    name="pincode"
                    value={address.pincode}
                    onChange={updateAddress}
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
                  Online Payment (Will Open Razorpay Later)
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
              <h2 className="text-md md:text-lg font-semibold mb-4">Review Order</h2>

              <div className="bg-white border rounded-md">
                {cartItems.map((i) => (
                  <div
                    key={i._id}
                    className="flex justify-between p-4 border-b"
                  >
                    <div className="flex gap-3">
                      <img
                        src={i.image}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                      <div>
                        <p className="font-medium">{i.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {i.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ₹
                      {((i.discountPrice || i.price) * i.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePlaceOrderNow}
                disabled={paymentProcessing}
                className="mt-8 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-md tracking-wide"
              >
                {paymentProcessing
                  ? "Creating Order..."
                  : `Place Order ₹${finalTotal.toLocaleString()}`}
              </button>
            </>
          )}
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        <div className="bg-[#fafafa] px-6 md:px-10 py-10 sticky top-0 h-fit">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between mb-6">
              <div className="flex gap-3">
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div>
                  <p className="font-medium text-sm md:text-md">{item.name}</p>
                </div>
              </div>

              <p className="font-semibold text-sm md:text-md">
                ₹
                {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
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
                {shippingCharge
                  ? `₹${shippingCharge.toLocaleString()}`
                  : "Calculated later"}
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
};

export default Checkout;
