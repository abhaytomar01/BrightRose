import axios from "axios";
import { loadRazorpay } from "../utils/razorpay";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";

export const useRazorpayCheckout = () => {
  const { authUser } = useAuth();

  const startPayment = async ({ cartItems, address, shippingCharge, totalAmount }) => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay SDK failed. Check connection.");
        return;
      }

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/create-order`,
        { amount: totalAmount },
        {
          headers: {
            Authorization: `Bearer ${authUser?.token || ""}`,
          },
        }
      );

      if (!orderResponse.data.success) {
        toast.error("Failed to create payment order.");
        return;
      }

      const { orderId, amount, currency } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Bright Rose",
        order_id: orderId,
        description: "Order Payment",
        theme: { color: "#ff4500" },

        handler: async function (response) {
          toast.info("Verifying payment...");

          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/verify-payment`,
              {
                ...response,
                cartItems,
                address,
                shippingCharge,
                total: totalAmount,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              window.location.href = "/user/orders";
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Verification error.");
          }
        },

        prefill: {
          name: authUser?.user?.name || address.name,
          email: authUser?.user?.email || address.email,
          contact: address.phone,
        },

        modal: {
          ondismiss: () => toast.warn("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", () => {
        toast.error("Payment failed");
      });

      rzp.open();
    } catch (err) {
      toast.error("Payment error");
    }
  };

  return { startPayment };
};
