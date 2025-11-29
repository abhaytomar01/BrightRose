/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import fallbackImage from "../../../assets/images/fallback.jpg";

const Product = ({ _id, name, price, images, func }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = async () => {
    setIsDeleting(true);
    try {
      await func(_id);
    } catch (error) {
      console.log("Wishlist delete error", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const imageUrl = images?.[0]?.url || fallbackImage;

  return (
    <div className="flex gap-4 border-b p-4 sm:pb-8 w-full overflow-hidden text-gray-800">

      {/* Product Image */}
      <div className="w-24 h-24 bg-white border rounded flex-shrink-0 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain"
          draggable="false"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between flex-1">

        {/* Name + Delete Button */}
        <div className="flex justify-between items-start">
          <Link to={`/product/${_id}`} className="w-56 sm:w-full">
            <p className="font-medium leading-snug hover:text-black">
              {name?.length > 60 ? `${name.substring(0, 60)}...` : name}
            </p>
          </Link>

          <button
            onClick={deleteProduct}
            disabled={isDeleting}
            className="text-gray-500 hover:text-red-600 transition"
          >
            <DeleteIcon />
          </button>
        </div>

        {/* Price */}
        <p className="text-lg font-semibold mt-2">
          ₹{price?.toLocaleString()}
        </p>

      </div>
    </div>
  );
};

export default Product;
