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
      className="flex flex-col gap-4 py-5 px-4 sm:px-6 border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 rounded-lg"
    >
      <div className="flex flex-col sm:flex-row gap-5 items-stretch w-full">
        {/* Image */}
        <div className="w-full sm:w-1/6 h-28 flex-shrink-0">
          <img
            draggable="false"
            className="h-full w-full object-contain rounded-lg"
            src={product?.image}
            alt={product?.name}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col justify-between gap-3 sm:gap-4 w-full">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 w-11/12">
              <p className="text-gray-800 font-medium leading-snug">
                {product?.name?.length > 60
                  ? `${product?.name?.substring(0, 60)}...`
                  : product?.name}
              </p>
              <span className="text-sm text-gray-500">
                Seller: {product?.brand?.name || "Unknown"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 text-lg sm:text-xl font-semibold">
            <span className="text-gray-900">
              ₹{(product?.discountPrice * product?.quantity).toLocaleString()}
            </span>
            {product?.price && product?.discountPrice < product?.price && (
              <>
                <span className="text-sm text-gray-400 line-through font-normal">
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

      {/* Actions */}
      <div className="flex justify-evenly sm:justify-start sm:gap-6 mt-2">
        <button
          onClick={moveToCartHandler}
          className="px-4 py-1.5 rounded-md bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-all duration-200"
        >
          Move to Cart
        </button>
        <button
          onClick={removeHandler}
          className="px-4 py-1.5 rounded-md border border-gray-300 font-medium text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SaveForLaterItem;
