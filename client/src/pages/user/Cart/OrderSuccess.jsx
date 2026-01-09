// client/src/pages/user/Order/OrderSuccess.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SeoData from "../../../SEO/SeoData";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();            // optional: /order-success/:id
  const [time, setTime] = useState(5);
  const timerRef = useRef(null);

  // Redirect timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t === 1) {
          clearInterval(timerRef.current);
          navigate("/user/orders");
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [navigate]);

  return (
    <>
      <SeoData title="Order Successful" />

      <main className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-6 py-20 font-[Manrope]">
        <div className="bg-white border border-[#e8e2d9] shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircleOutlineIcon className="text-green-600" style={{ fontSize: 55 }} />

            <h1 className="text-3xl font-semibold text-[#3c2f28]">
              Order Placed Successfully
            </h1>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed mt-2">
              Thank you for shopping with Bright Rose. Your order has been confirmed and is being processed.
            </p>

            {id && (
              <p className="text-xs text-gray-500 mt-1">
                Order ID: {id}
              </p>
            )}
          </div>

          <p className="mt-6 text-gray-600 text-sm">
            Redirecting to your orders in <span className="font-semibold">{time}</span> seconds…
          </p>

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
      </main>
    </>
  );
};

export default OrderSuccess;
