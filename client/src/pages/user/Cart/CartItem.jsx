import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; 
import { useCart } from "../../../context/cart"; // adjust path if needed

const CartItem = ({ item }) => {
  const {
    addToCart,
    removeFromCart,
    moveToSaveLater,
    updateQuantity,
  } = useCart();

  const handleRemove = () => {
    removeFromCart(item.key);
    toast.info(`${item.name} removed from cart`, { position: "bottom-right" });
  };

  const handleSaveForLater = () => {
    moveToSaveLater(item.key);
    toast.success(`${item.name} moved to Save for Later`, {
      position: "bottom-right",
    });
  };

  const handleIncrease = () => {
    const newQty = item.quantity + 1;
    addToCart(item, newQty);
    updateQuantity(item.key, newQty);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      addToCart(item, newQty);
      updateQuantity(item.key, newQty);
    } else {
      handleRemove();
    }
  };

  return (
    <motion.div
      layout
      className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded-2xl p-4 mb-4 w-full border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {/* Product Info */}
      <div className="flex items-center gap-4 w-full sm:w-1/2">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl border border-gray-200"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
          {item.category && (
            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
          )}
          {item.weave && (
            <p className="text-sm text-gray-500">
              <strong>Weave:</strong> {item.weave}
            </p>
          )}
          {item.color && (
            <p className="text-sm text-gray-500">
              <strong>Color:</strong> {item.color}
            </p>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-lg font-semibold text-gray-700 mt-2 sm:mt-0">
        ₹{item.price}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        <button
          onClick={handleDecrease}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
        >
          -
        </button>
        <span className="font-medium text-gray-800">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
        <button
          onClick={handleSaveForLater}
          className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-lg hover:bg-yellow-200 text-sm font-medium"
        >
          Save for Later
        </button>
        <button
          onClick={handleRemove}
          className="bg-red-100 text-red-600 px-4 py-1 rounded-lg hover:bg-red-200 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
