import { useState } from "react";
import { useCart } from "../../../context/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const {
    cartItems,
    subtotal,
    shipping,
    tax,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // Steps: 1 = Address, 2 = Payment, 3 = Review
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (step === 1) {
      if (!address.name || !address.address || !address.city) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const goBack = () => setStep(step - 1);

  // Razorpay Payment Handler ------------------------------------
  const loadRazorpayScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    try {
      const loaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!loaded) return toast.error("Failed to load Razorpay");

      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-checkout-session`,
        { amount: grandTotal },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      const { order } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Bright Rose",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              address,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            }
          );

          toast.success("Payment Successful!");
          clearCart();
          navigate("/user/orders");
        },

        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },

        theme: { color: "#AD000F" }, // Bright Rose Primary
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Payment failed.");
      console.log(error);
    }
  };

  const placeOrder = () => {
    if (paymentMethod === "cod") {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/user/orders");
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-12 px-4 md:px-10 font-[Manrope] mt-28 md:mt-40 flex justify-center">
      <div className="w-full max-w-5xl bg-white border border-[#e8e2d9] shadow-lg rounded-3xl p-8 md:p-12">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-wide">
          Checkout
        </h1>
        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#D4AF37] to-transparent mb-10"></div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          {["Address", "Payment", "Review"].map((label, idx) => {
            const active = step === idx + 1;
            const completed = step > idx + 1;

            return (
              <div key={label} className="flex flex-col items-center w-1/3">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-[16px] font-semibold
                  ${active
                      ? "bg-[#AD000F] text-white"
                      : completed
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                    }
                `}
                >
                  {idx + 1}
                </div>
                <span className="mt-3 text-sm tracking-wide">{label}</span>
              </div>
            );
          })}
          <div className="absolute top-6 left-[16%] right-[16%] h-[2px] bg-gray-300 -z-10"></div>
        </div>

        {/* Step 1 — Address */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: "name", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone Number" },
              { name: "address", label: "Full Address" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "pincode", label: "Pincode" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={address[field.name]}
                  onChange={handleAddressChange}
                  placeholder={field.label}
                  className="
                    border border-[#d8d2c8] bg-[#FDFDFC]
                    rounded-lg px-4 py-3 text-[15px]
                    focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
                    tracking-wide
                  "
                />
              </div>
            ))}

            <button
              onClick={nextStep}
              className="
                mt-6 sm:col-span-2 w-full py-3 rounded-lg
                bg-[#AD000F] text-white font-medium tracking-wide
                hover:bg-[#8C000C] transition
              "
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">
              Choose Payment Method
            </h2>

            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="text-[15px]">Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <span className="text-[15px]">Online Payment (Razorpay)</span>
              </label>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={goBack}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Back
              </button>

              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-lg bg-[#AD000F] text-white font-medium hover:bg-[#8C000C] transition"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Final Review + Quantity & Price */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">
              Order Summary
            </h2>

            <div className="border border-[#e8e2d9] rounded-xl divide-y bg-white">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-1/2">
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded-lg object-contain border border-[#e6e0d8]"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.brandName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.productId, item.quantity - 1)
                          : removeFromCart(item)
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="w-6 text-center">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ₹{(item.discountPrice * item.quantity).toLocaleString()}
                    </p>
                    {item.discountPrice < item.price && (
                      <p className="text-sm line-through text-gray-400">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 text-sm text-gray-700 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={goBack}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Back
              </button>

              <button
                onClick={placeOrder}
                className="px-6 py-2 rounded-lg bg-[#AD000F] text-white font-medium hover:bg-[#8C000C] transition"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
