import { useState } from "react";
import { useCart } from "../../../context/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

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

  // 🧾 Razorpay Integration
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_YourKeyHere", // Replace with your Razorpay key
      amount: grandTotal * 100,
      currency: "INR",
      name: "The Digital Radio",
      description: "Order Payment",
      handler: function (response) {
        toast.success("Payment Successful!");
        clearCart();
        navigate("/user/orders");
      },
      prefill: {
        name: address.name,
        email: address.email,
        contact: address.phone,
      },
      theme: {
        color: "#111827",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 mt-28 md:mt-36 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Checkout</h1>

        {/* Progress Bar */}
        <div className="flex justify-between mb-10 relative">
          {["Address", "Payment", "Review"].map((label, idx) => {
            const active = step === idx + 1;
            const completed = step > idx + 1;
            return (
              <div key={label} className="flex flex-col items-center w-1/3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                    active
                      ? "bg-blue-600 text-white"
                      : completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 text-sm">{label}</span>
              </div>
            );
          })}
          <div className="absolute top-5 left-[16%] right-[16%] h-[2px] bg-gray-200 -z-10"></div>
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: "name", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone Number" },
              { name: "address", label: "Address" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "pincode", label: "Pincode" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={address[field.name]}
                  onChange={handleAddressChange}
                  placeholder={field.label}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            ))}
            <button
              onClick={nextStep}
              className="mt-6 sm:col-span-2 bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Choose Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <span>Online Payment (Razorpay)</span>
              </label>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={goBack}
                className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review + Quantity Update */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Order Summary</h2>

            <div className="border rounded-lg divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-1/2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.brandName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.productId, item.quantity - 1)
                          : removeFromCart(item)
                      }
                      className="w-7 h-7 flex items-center justify-center border rounded-md text-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border rounded-md text-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ₹{(item.discountPrice * item.quantity).toLocaleString()}
                    </p>
                    {item.discountPrice < item.price && (
                      <p className="text-sm text-gray-400 line-through">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (12%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={goBack}
                className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={placeOrder}
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
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
