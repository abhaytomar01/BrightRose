// client/src/pages/user/Checkout/Checkout.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";

export default function Checkout() {
  // ---------- Hooks ----------
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, subtotal, clearCart } = useCart();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [step, setStep] = useState(1);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [dbOrderId, setDbOrderId] = useState(null);

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // ---------- Load addresses from backend ----------
  useEffect(() => {
    const loadUserAddresses = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const list = data.addresses || [];
        setUserAddresses(list);

        if (list.length > 0) {
          const def = list.find(a => a.isDefault) || list[0];
          setSelectedAddressId(def._id);
          setShippingInfo({
            address: def.address,
            city: def.city,
            state: def.state,
            pincode: def.pincode,
            phoneNo: def.phone,
            name: def.name,
          });
        }
      } catch (err) {
        console.error("Load addresses failed:", err);
      }
    };

    loadUserAddresses();
  }, [token]);

  // ---------- Auth guard ----------
  useEffect(() => {
    if (!token) {
      localStorage.setItem(
        "redirectAfterLogin",
        location.pathname || "/checkout"
      );
      navigate("/login");
    }
  }, [token, navigate, location.pathname]);

  // ---------- Safe numeric totals ----------
  const safeSubtotal = Number(subtotal || 0);
  const safeShipping = Number(shippingCharge || 0);
  const finalTotal = safeSubtotal + safeShipping;

  // ---------- Shipping calculation ----------
  const fetchShippingCharge = async () => {
    if (!shippingInfo || !selectedAddressId) {
  toast.error("Please select a shipping address");
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
        toast.error("Failed to calculate shipping");
      }
    } catch (err) {
      console.error(err);
      toast.error("Shipping service unavailable");
    } finally {
      setLoadingShipping(false);
    }
  };

  // ---------- Razorpay loader ----------
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ---------- Payment flow ----------
  const handlePayment = async () => {
    if (!cartItems.length) {
      toast.error("Cart is empty");
      return;
    }

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

      // 1) Create order on backend
      const orderRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        {
          amount: Math.round(finalTotal), // rupees
          cartItems,
          shippingAddress: {
            ...shippingInfo,
            shippingCharge: safeShipping,
          },
        },
        authConfig
      );

      if (!orderRes.data?.success) {
        toast.error("Failed to create order");
        return;
      }

      const { orderId, currency, dbOrderId: dbId } = orderRes.data;
      setDbOrderId(dbId);

      // 2) Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: finalTotal * 100, // paise
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
            // 3) Verify payment on backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: dbId,
              }
            );

            if (verifyRes.data?.success) {
              const orderId = verifyRes.data.orderId;

              toast.success("Order placed successfully");
              clearCart();
              const userId = authUser?.user?._id || "guest";
              localStorage.removeItem(`brightrose_cart_v1_${userId}`);

              navigate(`/order-success/${orderId}`);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error");
          }
        },
        theme: { color: "#000000" },
      });

      rzp.on("payment.failed", function () {
        toast.error("Payment failed");
      });

      rzp.open();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in to continue.");
        localStorage.setItem("redirectAfterLogin", "/checkout");
        navigate("/login");
      } else {
        console.error(err);
        toast.error("Payment failed");
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ---------- Step control ----------
  const nextStep = async () => {
    if (step === 1) {
      await fetchShippingCharge();
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-[#fafafa] mt-10 md:mt-20">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* LEFT */}
        <div className="px-6 md:px-12 py-10 border-r">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Shipping</h2>

              {/* Saved addresses from account */}
              <div className="space-y-3 mb-6">
                {userAddresses.map((addr) => (
                  <label
                    key={addr._id}
                    className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mr-3"
                      checked={selectedAddressId === addr._id}
                      onChange={() => {
                        setSelectedAddressId(addr._id);
                        setShippingInfo({
                          address: addr.address,
                          city: addr.city,
                          state: addr.state,
                          pincode: addr.pincode,
                          phoneNo: addr.phone,
                          name: addr.name,
                        });
                      }}
                    />
                    <div>
                      <p className="font-medium">{addr.name}</p>
                      <p>
                        {addr.address}, {addr.city}, {addr.state} –{" "}
                        {addr.pincode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}

                {userAddresses.length === 0 && (
                  <p className="text-sm">
                    No saved address.{" "}
                    <button
  onClick={() =>
    navigate("/user/dashboard/address?redirect=/checkout")
  }
  className="underline"
>
  Add address in your account
</button>

                  </p>
                )}
              </div>

              <button
                onClick={nextStep}
                disabled={loadingShipping || !selectedAddressId}
                className="mt-2 w-full bg-black text-white py-4 rounded-md"
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
                <button
                  onClick={prevStep}
                  className="underline text-sm"
                >
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
              <h2 className="text-lg font-semibold mb-4">
                Review Order
              </h2>

              {cartItems.map((i) => {
                const unit = Number(i.discountPrice ?? i.price ?? 0);
                const qty = Number(i.quantity || 0);
                const lineTotal = unit * qty;

                return (
                  <div
                    key={i.key || i._id}
                    className="flex justify-between py-3 border-b"
                  >
                    <span>
                      {i.name} × {qty}
                    </span>
                    <span>₹{lineTotal.toLocaleString()}</span>
                  </div>
                );
              })}

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className={`mt-8 w-full py-4 rounded-md text-white ${
                  paymentProcessing
                    ? "bg-gray-400"
                    : "bg-black hover:bg-gray-900"
                }`}
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
              <span>₹{safeSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{safeShipping.toLocaleString()}</span>
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
