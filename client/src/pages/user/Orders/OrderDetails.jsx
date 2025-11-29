import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/auth";
import Spinner from "../../../components/Spinner";
import MinCategory from "../../../components/MinCategory";
import SeoData from "../../../SEO/SeoData";
import Tracker from "./Tracker";

const OrderDetails = () => {
  const { id } = useParams();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(res.data.order);
      } catch (err) {
        console.error("Order details error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token, id]);

  if (loading) return <Spinner />;
  if (!order) return <p className="p-10">Order not found.</p>;

  const { products, buyer, shippingInfo, amount, orderStatus, createdAt } =
    order;

  return (
    <>
      <SeoData title="Order Details | Bright Rose" />
      <MinCategory />

      <main className="px-4 sm:px-10 py-10">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Address */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>

            <p className="font-medium">{buyer?.name}</p>
            <p className="text-sm text-gray-600">{buyer?.email}</p>
            <p className="text-sm">
              {shippingInfo?.address}, {shippingInfo?.city},{" "}
              {shippingInfo?.state} - {shippingInfo?.pincode}
            </p>
            <p className="text-sm mt-1">Phone: {shippingInfo?.phoneNo}</p>
          </div>

          {/* Items */}
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded shadow p-6 flex gap-5"
            >
              <img
                src={item.image}
                className="w-28 h-28 object-contain"
                draggable="false"
              />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                <p className="font-semibold mt-2">
                  ₹{item.quantity * item.discountPrice}
                </p>
              </div>
            </div>
          ))}

          {/* Tracker */}
          <div className="bg-white rounded shadow p-6">
            <Tracker
              orderOn={createdAt}
              activeStep={
                orderStatus === "Delivered"
                  ? 3
                  : orderStatus === "Out For Delivery"
                  ? 2
                  : orderStatus === "Shipped"
                  ? 1
                  : 0
              }
            />
          </div>

        </div>
      </main>
    </>
  );
};

export default OrderDetails;
