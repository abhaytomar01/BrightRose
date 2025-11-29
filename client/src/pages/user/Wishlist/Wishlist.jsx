import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { getWishlistAPI, toggleWishlistAPI } from "../../../api/wishlist";
import Spinner from "../../../components/Spinner";
import MinCategory from "../../../components/MinCategory";
import Product from "./Product";
import { toast } from "react-toastify";
import SeoData from "../../../SEO/SeoData";

const Wishlist = () => {
  const { authUser, wishlist, setWishlist } = useAuth();

  const token = authUser?.token;
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount
  useEffect(() => {
    if (!token) return;

    setLoading(true);

    getWishlistAPI(token)
      .then((res) => {
        setWishlist(res.data.wishlist || []);
      })
      .catch((err) => {
        console.error("Wishlist Load Error:", err);
      })
      .finally(() => setLoading(false));
  }, [token, setWishlist]);

  const removeItem = async (productId) => {
    if (!token) return;

    try {
      const res = await toggleWishlistAPI(productId, token);

      setWishlist(res.data.wishlist || []);

      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove item");
    }
  };

  return (
    <>
      <SeoData title="My Wishlist" />
      <MinCategory />

      {loading ? (
        <Spinner />
      ) : (
        <div className="flex gap-3.5 w-full sm:w-11/12 sm:mt-4 m-auto pb-7">
          <div className="flex-1 shadow bg-white">

            <div className="flex flex-col">
              <span className="font-medium text-lg px-4 sm:px-8 py-4 border-b">
                My Wishlist ({wishlist.length})
              </span>

              {wishlist.length === 0 ? (
                <div className="flex items-center flex-col gap-3 m-6">
                  <img
                    src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/mywishlist-empty_39f7a5.png"
                    className="object-contain"
                    alt="Empty Wishlist"
                  />
                  <span className="text-lg font-medium mt-6">Empty Wishlist</span>
                  <p className="text-gray-500">
                    You have no items in your wishlist.
                  </p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <Product key={item._id} {...item} func={removeItem} />
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
