/* eslint-disable react/prop-types */
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
    >
      <div className="relative group overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-[#ad000f] hover:text-white transition-all"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-[#ad000f] hover:text-white transition-all"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 flex-grow">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#ad000f] font-bold text-lg">₹{product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#ad000f] text-white px-4 py-2 rounded-full hover:bg-black transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
