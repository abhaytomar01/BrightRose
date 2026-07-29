// client/src/pages/user/Order/OrderSuccess.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SeoData from "../../../SEO/SeoData";
import axios from "axios";
import { useAuth } from "../../../context/auth";

const OrderSuccess = () => {
  const { id } = useParams(); // /order-success/:id
  const { authUser } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id && authUser?.token) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/v1/orders/order/${id}`, {
          headers: { Authorization: `Bearer ${authUser.token}` },
        })
        .then((res) => setOrder(res.data.order))
        .catch((err) => console.log("Failed to fetch order for success page", err));
    }
  }, [id, authUser]);

  return (
    <>
      <SeoData title="Order Successful | Bright Rose" />

      <main className="min-h-screen bg-[#F8F6F3] flex items-center justify-center px-4 py-20 font-[Manrope]">
        <div className="bg-white border border-[#e8e2d9] shadow-xl rounded-2xl p-8 md:p-12 max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <CheckCircleOutlineIcon className="text-green-600 mb-4" style={{ fontSize: 64 }} />
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] tracking-tight mb-3">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for shopping with Bright Rose.
            </p>
            {order ? (
              <div className="mt-6 inline-block bg-green-50 text-green-800 px-6 py-3 rounded-full border border-green-200">
                <span className="text-sm uppercase tracking-widest font-semibold">Order No.</span>
                <span className="ml-2 font-bold text-lg">{order.publicOrderId || order._id}</span>
              </div>
            ) : id ? (
              <div className="mt-6 inline-block bg-gray-50 text-gray-800 px-6 py-3 rounded-full border border-gray-200">
                <span className="text-sm uppercase tracking-widest font-semibold">Order No.</span>
                <span className="ml-2 font-bold text-lg">{id}</span>
              </div>
            ) : null}
          </div>

          <hr className="border-[#e8e2d9] mb-8" />

          {/* Timeline / What happens next */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">What happens next?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-[#f4f1ee] p-3 rounded-full text-[#1a1a1a]">
                  <EmailOutlinedIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Confirmation</h3>
                  <p className="text-gray-600 text-sm mt-1">We've sent a confirmation email with your invoice to your inbox.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#f4f1ee] p-3 rounded-full text-[#1a1a1a]">
                  <Inventory2OutlinedIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quality Check & Packing</h3>
                  <p className="text-gray-600 text-sm mt-1">Our team is carefully inspecting and packing your handloom pieces.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#f4f1ee] p-3 rounded-full text-[#1a1a1a]">
                  <LocalShippingOutlinedIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shipping</h3>
                  <p className="text-gray-600 text-sm mt-1">You will receive an email with tracking details once your order is dispatched.</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#e8e2d9] mb-8" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/user/orders"
              className="px-8 py-3.5 rounded bg-[#1a1a1a] text-white font-medium text-center hover:bg-black transition-colors"
            >
              Track Order Status
            </Link>
            <Link
              to="/products"
              className="px-8 py-3.5 rounded bg-white border border-[#1a1a1a] text-[#1a1a1a] font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderSuccess;
