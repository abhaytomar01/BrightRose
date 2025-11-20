import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 font-[Manrope]">

      {/* Illustration */}
      <div className="w-56 h-48 mb-4">
        <img
          draggable="false"
          className="w-full h-full object-contain opacity-90"
          src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png"
          alt="Empty Cart"
        />
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-[#3c2f28] font-semibold tracking-wide">
        Your Cart is Empty
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 text-sm md:text-base mt-2">
        Looks like you haven’t added anything yet.
      </p>

      {/* Button */}
      <Link
        to="/products"
        className="
          mt-6 px-10 py-3 rounded-lg 
          bg-[#AD000F] text-white 
          text-sm md:text-base font-medium 
          tracking-wide shadow-sm
          hover:bg-[#8c000c] transition-all
        "
      >
        Shop Now
      </Link>
    </div>
  );
};

export default EmptyCart;
