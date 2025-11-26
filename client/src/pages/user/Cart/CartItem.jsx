import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../../../context/cart";

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
      className="
        flex flex-col sm:flex-row justify-between items-center 
        bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        p-5 mb-5 w-full border border-[#e8e2d9]
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
        transition-all duration-300
      "
    >
      {/* LEFT — Product Image + Info */}
      <div className="flex items-start gap-5 w-full sm:w-1/2">
        <img
          src={item.image || '/placeholder.png'}
          alt={item.name}
          className="
            w-24 h-24 object-cover rounded-xl 
            border border-[#e6dccf]
            shadow-sm
          "
        />

        <div>
          <h2 className="text-lg font-medium text-[#4a3b32] leading-snug">
            {item.name}
          </h2>

          {item.category && (
            <p className="text-sm text-[#8c7d6d] mt-1">{item.category}</p>
          )}

          {item.weave && (
            <p className="text-sm text-[#8c7d6d]">
              <span className="font-medium text-[#704214]">Weave:</span> {item.weave}
            </p>
          )}

          {item.color && (
            <p className="text-sm text-[#8c7d6d]">
              <span className="font-medium text-[#704214]">Color:</span> {item.color}
            </p>
          )}
        </div>
      </div>

      {/* PRICE */}
      <div className="text-xl font-semibold text-neutralDark/80 mt-3 sm:mt-0">
        ₹{item.price}
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <button
          onClick={handleDecrease}
          className="
            px-3 py-1 rounded-md 
            bg-neutralDark/10 text-neutralDark/70
            hover:bg-neutralDark/30 
            transition
          "
        >
          -
        </button>

        <span className="font-medium text-[#4a3b32]">{item.quantity}</span>

        <button
          onClick={handleIncrease}
          className="
            px-3 py-1 rounded-md 
            bg-neutralDark/10 text-neutralDark/70
            hover:neutralDark/30 
            transition
          "
        >
          +
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
        <button
          onClick={handleSaveForLater}
          className="
            px-4 py-1.5 rounded-md text-sm font-medium
            border border-neutralDark text-neutralDark/80
            hover:bg-[#f9f5ef]
            transition-all
          "
        >
          Save for Later
        </button>

        <button
          onClick={handleRemove}
          className="
            px-4 py-1.5 rounded-md text-sm font-medium
            border border-neutralDark/80 text-neutralDark/90
            hover:bg-[#fff4f4]
            transition-all
          "
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
