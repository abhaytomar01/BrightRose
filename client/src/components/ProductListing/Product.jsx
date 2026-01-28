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
  // Pick main image safely
  const mainImage =
    images && images.length > 0 && images[0]?.url
      ? images[0].url
      : fallbackImage;

  /**
   * IMPORTANT:
   * Your backend / CDN should ideally support width params.
   * If not, this STILL works — browser will reuse the same image.
   */
  const image400 = mainImage;
  const image800 = mainImage;
  const image1600 = mainImage;

  return (
    <motion.div
      className="w-full bg-white overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* IMAGE */}
      <Link to={`/product/${_id}`}>
        <div className="
  relative
  w-full
  aspect-[3/4]
  bg-[#dfd8d7]
  overflow-hidden
">
  <img
     src={mainImage}
  loading="lazy"
  decoding="async"
  alt={name}
  className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
    object-center
    transition-transform
    duration-500
    will-change-transform
    hover:scale-[1.02]
  "
  />
</div>

      </Link>

      {/* TEXT */}
      <div className="text-center py-3">
        <h3 className="text-[12px] md:text-[14px] font-medium tracking-wide line-clamp-2">
          {name}
        </h3>

        <p className="text-[13px] md:text-[16px] font-semibold mt-1">
          ₹{price?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default Product;
