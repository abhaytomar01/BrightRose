import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useCart } from "../../../context/cart";
import { useAuth } from "../../../context/auth";
import axios from "axios";
import Spinner from "./../../../components/Spinner";
import SeoData from "../../../SEO/SeoData";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(3);
  const [cartItems, setCartItems] = useCart();
  const { auth } = useAuth();

  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSavedPayment, setHasSavedPayment] = useState(false);

  // Load sessionId on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    setSessionId(storedSessionId);
  }, []);

  // Save order + Clear cart
  useEffect(() => {
    const savePayment = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/payment-success`,
          {
            sessionId: sessionId,
            orderItems: cartItems,
          },
          {
            headers: { Authorization: auth?.token },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("cart");
          localStorage.removeItem("sessionId");
          setCartItems([]);
          setHasSavedPayment(true);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (sessionId && cartItems.length > 0 && !hasSavedPayment) {
      savePayment();
    }
  }, [sessionId, cartItems, hasSavedPayment, auth?.token, setCartItems]);

  // Redirect timer
  const timerRef = useRef(null);
  useEffect(() => {
    if (!loading) {
      timerRef.current = setInterval(() => {
        setTime((t) => {
          if (t === 1) {
            clearInterval(timerRef.current);
            navigate("/user/orders");
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [loading, navigate]);

  return (
    <>
      <SeoData title="Order Successful" />

      <main className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-6 py-20 font-[Manrope]">

        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white border border-[#e8e2d9] shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">

            {/* Success Icon + Title */}
            <div className="flex flex-col items-center gap-4">
              <CheckCircleOutlineIcon className="text-green-600" style={{ fontSize: 55 }} />

              <h1 className="text-3xl font-semibold text-[#3c2f28]">
                Order Placed Successfully
              </h1>

              <p className="text-gray-700 text-sm md:text-base leading-relaxed mt-2">
                Thank you for shopping with Bright Rose.  
                Your order has been confirmed and is being processed.
              </p>
            </div>

            {/* Timer */}
            <p className="mt-6 text-gray-600 text-sm">
              Redirecting to your orders in <span className="font-semibold">{time}</span> seconds…
            </p>

            {/* CTA */}
            <Link
              to="/user/orders"
              className="
                mt-6 inline-block px-10 py-3 rounded-lg
                bg-[#AD000F] text-white font-medium tracking-wide
                hover:bg-[#8c000c] transition-all shadow-sm
              "
            >
              View Orders
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default OrderSuccess;
