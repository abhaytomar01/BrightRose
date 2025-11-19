/* eslint-disable react/prop-types */
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { getDiscount } from "../../utils/functions";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { motion } from "framer-motion";

const Product = ({
  _id,
  images,
  name,
  ratings,
  numOfReviews,
  price,
  discountPrice,
  wishlistItems,
  setWishlistItems,
}) => {
  const { auth, isAdmin } = useAuth();
  const itemInWishlist = wishlistItems?.some((itemId) => itemId === _id);

  const updateWishlistUI = (add) => {
    setWishlistItems((prev) =>
      add ? [...prev, _id] : prev.filter((item) => item !== _id)
    );
  };

  const addToWishlistHandler = async () => {
    const type = itemInWishlist ? "remove" : "add";
    try {
      updateWishlistUI(type === "add");
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/update-wishlist`,
        { productId: _id, type },
        { headers: { Authorization: auth.token } }
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again later.", {
        toastId: "error",
      });
      updateWishlistUI(type !== "add");
    }
  };

  return (
    <div>
      <ScrollToTopOnRouteChange />

      <motion.div
        whileHover={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[290px] mb-3 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        {/* Wishlist */}
        {/* {!isAdmin && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={addToWishlistHandler}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition ${
              itemInWishlist ? "text-rose-500" : "text-gray-400 hover:text-rose-500"
            }`}
          >
            <FavoriteIcon sx={{ fontSize: 20 }} />
          </motion.button>
        )} */}

        {/* Product Image */}
        <Link to={`/product/${_id}`}>
          <div className="relative w-full h-60 bg-white flex items-center justify-center overflow-hidden">
            <motion.img
              src={images && (images[0]?.url || images[0])}
              alt={name}
              draggable="false"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="object-cover w-full h-full rounded-t-md"
            />

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-sm font-medium opacity-0 transition-opacity"
            >
              View Details
            </motion.div>
          </div>
        </Link>

        {/* Info Section */}
        <div className="p-4 flex flex-col gap-2">
          {/* Product Name */}
          <h2 className="text-sm sm:text-base font-medium text-gray-900 truncate group-hover:text-rose-600 transition">
            {name}
          </h2>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              ₹{discountPrice?.toLocaleString() || price}
            </span>
            {price && discountPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{price?.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  {getDiscount(price, discountPrice)}% off
                </span>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
            <span className="flex items-center gap-1 text-yellow-500">
              <StarIcon sx={{ fontSize: 14 }} />
              {ratings?.toFixed(1) || 4.5}
            </span>
            <span>({numOfReviews || 0})</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Product;
