/* eslint-disable react/prop-types */
import { useCart } from "../../../context/cart";
import { getDiscount } from "../../../utils/functions";

const SaveForLaterItem = ({ product }) => {
  const { moveToCartFromSaveLater, removeFromSaveLater } = useCart();

  const moveToCartHandler = () => {
    moveToCartFromSaveLater(product.key, product.quantity || 1);
  };

  const removeHandler = () => {
    removeFromSaveLater(product.key);
  };

  return (
    <div
      key={product.key}
      className="
        font-[Manrope]
        bg-white border border-[#e8e2d9] rounded-2xl 
        p-5 sm:p-6 mb-5 shadow-sm hover:shadow-md 
        transition-all duration-300
      "
    >
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row gap-6">

        {/* Image */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0">
          <img
            draggable="false"
            className="h-full w-full object-cover rounded-xl border border-[#eee]"
            src={product?.image}
            alt={product?.name}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">

          {/* Title & Seller */}
          <div>
            <p className="text-[#2b2b2b] text-[15px] font-semibold leading-snug">
              {product?.name?.length > 60
                ? `${product?.name?.substring(0, 60)}...`
                : product?.name}
            </p>

            <span className="text-sm text-gray-500 mt-1 block">
              Seller: {product?.brand?.name || "Unknown"}
            </span>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 mt-3">

            <span className="text-xl font-bold text-[#1a1a1a]">
              ₹{(product?.discountPrice * product?.quantity).toLocaleString()}
            </span>

            {product?.price &&
              product?.discountPrice < product?.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{(product?.price * product?.quantity).toLocaleString()}
                  </span>

                  <span className="text-sm text-green-600 font-medium">
                    {getDiscount(product?.price, product?.discountPrice)}% off
                  </span>
                </>
              )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-start gap-4 mt-6">

        <button
          onClick={moveToCartHandler}
          className="
            px-5 py-2 rounded-lg text-white text-sm font-semibold 
            bg-[#AD000F] hover:bg-[#8c000c]
            transition-all duration-200
          "
        >
          Move to Cart
        </button>

        <button
          onClick={removeHandler}
          className="
            px-5 py-2 rounded-lg text-sm font-medium  
            border border-gray-300 text-gray-700 
            hover:bg-gray-100 transition-all duration-200
          "
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SaveForLaterItem;
