/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const Product = ({
  _id,
  images,
  name,
  ratings,
  numOfReviews,
  price,
  wishlistItems,
  setWishlistItems,
}) => {
  const { auth } = useAuth();
  const itemInWishlist = wishlistItems?.includes(_id);

  const updateWishlistUI = (add) => {
    setWishlistItems((prev) =>
      add ? [...prev, _id] : prev.filter((id) => id !== _id)
    );
  };

  const handleWishlist = async () => {
    const type = itemInWishlist ? "remove" : "add";

    try {
      updateWishlistUI(type === "add");

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/update-wishlist`,
        { productId: _id, type },
        { headers: { Authorization: auth?.token } }
      );
    } catch (err) {
      toast.error("Could not update wishlist!");
      updateWishlistUI(type !== "add");
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35 }}
      className="relative bg-white rounded-2xl border border-[#e7dfd4] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm transition hover:shadow-md
          ${itemInWishlist ? "text-[#d6001c]" : "text-gray-500 hover:text-[#d6001c]"}`}
      >
        <FavoriteIcon sx={{ fontSize: 20 }} />
      </button>

      {/* Image */}
      <Link to={`/product/${_id}`}>
        <div className="relative w-full h-[310px] bg-[#faf7f2] overflow-hidden flex items-center justify-center">
          <motion.img
            src={images?.[0]?.url || images?.[0]}
            alt={name}
            className="object-cover w-full h-full rounded-t-2xl"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 text-white flex items-center justify-center text-sm tracking-wide"
          >
            View Details
          </motion.div>
        </div>
      </Link>

      {/* Info Section */}
      <div className="px-4 py-5 flex flex-col gap-2">
        <h2 className="text-[15px] leading-tight font-medium text-gray-900 tracking-wide line-clamp-2">
          {name}
        </h2>

        {/* PRICE (Single Price Only) */}
        <p className="text-lg font-semibold tracking-wide text-[#AD000F]">
          ₹{price?.toLocaleString()}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
          <span className="text-yellow-500 flex items-center gap-1">
            <StarIcon sx={{ fontSize: 15 }} />
            {ratings?.toFixed(1) || "4.8"}
          </span>
          <span>({numOfReviews || 0})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
