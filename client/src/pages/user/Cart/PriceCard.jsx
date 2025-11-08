/* eslint-disable react/prop-types */
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const PriceCard = ({ cartItems }) => {
    // Base calculations
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

    // Tax rate (e.g., 18%)
    const taxRate = 0.18;
    const taxAmount = subtotal * taxRate;

    // Shipping charge rule
    const shippingCharge = subtotal > 30000 ? 0 : 150;

    // Final total (subtotal + tax + shipping)
    const totalAmount = subtotal + taxAmount + shippingCharge;

    return (
        <div className="flex sticky top-16 sm:h-screen flex-col sm:w-4/12 sm:px-1">
            {/* Price Summary Card */}
            <div className="flex flex-col bg-white rounded-sm shadow">
                <h1 className="px-6 py-3 border-b font-medium text-gray-500">
                    PRICE DETAILS
                </h1>

                <div className="flex flex-col gap-4 p-6 pb-3">
                    <p className="flex justify-between">
                        Price ({cartItems?.length} item
                        {cartItems?.length > 1 ? "s" : ""})
                        <span>₹{subtotal.toLocaleString()}</span>
                    </p>

                    <p className="flex justify-between">
                        Discount{" "}
                        <span className="text-primary-green">
                            - ₹{discount.toLocaleString()}
                        </span>
                    </p>

                    <p className="flex justify-between">
                        Tax (Included 18%){" "}
                        <span>₹{taxAmount.toLocaleString()}</span>
                    </p>

                    <p className="flex justify-between">
                        Delivery Charges{" "}
                        {shippingCharge === 0 ? (
                            <span className="text-primary-green">FREE</span>
                        ) : (
                            <span>₹{shippingCharge.toLocaleString()}</span>
                        )}
                    </p>

                    <div className="border border-dashed my-2"></div>

                    <p className="flex justify-between text-lg font-medium">
                        Total Amount{" "}
                        <span>₹{totalAmount.toLocaleString()}</span>
                    </p>

                    <div className="border border-dashed my-2"></div>

                    <p className="font-medium text-primary-green">
                        You will save ₹{discount.toLocaleString()} on this order
                    </p>
                </div>
            </div>

            <div className="flex gap-3 items-center my-4 p-2">
                <VerifiedUserIcon className="text-gray-600" />
                <p className="text-gray-500 w-full text-[14px] font-[500]">
                    Safe and Secure Payments. Easy returns. 100% Authentic
                    products.
                </p>
            </div>
        </div>
    );
};

export default PriceCard;
