import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SeoData from "../../../SEO/SeoData";

const OrderFailed = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(3);

  useEffect(() => {
    if (time === 0) {
      navigate("/cart");
      return;
    }
    const interval = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <>
      <SeoData title="Transaction Failed" />

      <main className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-6 py-20 font-[Manrope]">
        <div className="bg-white shadow-lg border border-[#e8e2d9] rounded-2xl p-10 max-w-lg w-full text-center">

          {/* Icon + Heading */}
          <div className="flex flex-col items-center gap-3">
            <ErrorOutlineIcon className="text-red-600" style={{ fontSize: 50 }} />
            <h1 className="text-3xl font-semibold text-[#3c2f28]">
              Transaction Failed
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-gray-700 mt-4 text-sm md:text-base">
            Something went wrong while processing your payment.
          </p>

          {/* Redirect Timer */}
          <p className="mt-3 text-gray-600 text-sm">
            Redirecting to your cart in <span className="font-semibold">{time}</span> seconds…
          </p>

          {/* CTA Button */}
          <Link
            to="/cart"
            className="
              mt-6 inline-block px-10 py-3 rounded-lg
              bg-[#AD000F] text-white font-medium tracking-wide
              hover:bg-[#8c000c] transition-all shadow-sm
            "
          >
            Go to Cart
          </Link>
        </div>
      </main>
    </>
  );
};

export default OrderFailed;
