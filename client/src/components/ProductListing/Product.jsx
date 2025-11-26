/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import fallbackImage from "../../assets/images/fallback.jpg";
import { motion } from "framer-motion";

const Product = ({
  _id,
  images,
  name,
  price,
}) => {
  return (
    <motion.div
      className="w-full bg-white overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* IMAGE */}
      <Link to={`/product/${_id}`}>
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md">
          <img
            src={images?.[0]?.url || fallbackImage}
            className="w-full h-full object-cover transition-all duration-500"
            alt={name}
          />
        </div>
      </Link>

      {/* TEXT */}
      <div className="text-center py-3">
        <h3 className="text-[15px] font-medium tracking-wide line-clamp-2">
          {name}
        </h3>

        <p className="text-[16px] font-semibold mt-1">
          ₹{price?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default Product;
