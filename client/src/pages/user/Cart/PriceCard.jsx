/* eslint-disable react/prop-types */
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const PriceCard = ({ cartItems }) => {
  // Price Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  const discount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.price * item.quantity - item.discountPrice * item.quantity),
    0
  );

  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;

  const shippingCharge = subtotal > 30000 ? 0 : 150;

  const totalAmount = subtotal + taxAmount + shippingCharge;

  return (
    <div className="sticky top-24 font-[Manrope] sm:h-screen flex flex-col sm:w-4/12 sm:px-2">

      {/* Price Card */}
      <div className="bg-white rounded-2xl shadow-md border border-[#e8e2d9] overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#efeae3] bg-[#F8F6F3]">
          <h1 className="text-lg font-semibold tracking-wide text-[#3b2f28]">
            PRICE DETAILS
          </h1>
        </div>

        {/* Price List */}
        <div className="px-6 py-5 space-y-4 text-sm text-[#4A4A4A]">

          <div className="flex justify-between">
            <span>
              Price ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
            </span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span className="font-semibold text-green-600">
              -₹{discount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax (18%)</span>
            <span>₹{taxAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Charges</span>
            {shippingCharge === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              <span>₹{shippingCharge.toLocaleString()}</span>
            )}
          </div>

          <div className="border-t border-dashed my-4"></div>

          <div className="flex justify-between text-lg font-bold text-[#2b2b2b]">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>

          <div className="border-t border-dashed my-4"></div>

          <p className="text-green-700 font-medium text-sm">
            You will save ₹{discount.toLocaleString()} on this order
          </p>
        </div>
      </div>

      {/* Safe Payment Line */}
      <div className="flex gap-3 items-center bg-[#F8F6F3] border border-[#e8e2d9] rounded-xl mt-5 px-4 py-3">
        <VerifiedUserIcon className="text-[#7a7068]" />
        <p className="text-gray-600 text-[13px] font-medium leading-relaxed">
          Safe and Secure Payments. Easy Returns. 100% Authentic Products.
        </p>
      </div>
    </div>
  );
};

export default PriceCard;
