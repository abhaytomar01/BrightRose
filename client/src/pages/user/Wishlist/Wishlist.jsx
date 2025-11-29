import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { getWishlistAPI, toggleWishlistAPI } from "../../../api/wishlist";
import Spinner from "../../../components/Spinner";
import Product from "./Product";
import { toast } from "react-toastify";
import SeoData from "../../../SEO/SeoData";

const Wishlist = () => {
  const { authUser, wishlist, setWishlist } = useAuth();

  const token = authUser?.token;
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // LOAD WISHLIST FROM BACKEND
  // -------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    setLoading(true);

    getWishlistAPI(token)
      .then((res) => {
        const list = Array.isArray(res.data.wishlist)
          ? res.data.wishlist
          : [];

        setWishlist(list);
      })
      .catch((err) => {
        console.error("Wishlist Load Error:", err);
      })
      .finally(() => setLoading(false));
  }, [token, setWishlist]);

  // -------------------------------------------------------
  // REMOVE ITEM (TOGGLE)
  // -------------------------------------------------------
  const removeItem = async (productId) => {
    if (!token) {
      toast.error("Please login to update wishlist");
      return;
    }

    try {
      const res = await toggleWishlistAPI(productId, token);

      const updatedList = Array.isArray(res.data.wishlist)
        ? res.data.wishlist
        : [];

      setWishlist(updatedList);

      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Wishlist Remove Error:", err);
      toast.error("Failed to remove item");
    }
  };

  // -------------------------------------------------------
  // RENDER UI
  // -------------------------------------------------------
  return (
    <>
      <SeoData title="My Wishlist" />

      {loading ? (
        <Spinner />
      ) : (
        <div className="flex gap-3.5 w-full sm:w-11/12 sm:mt-4 m-auto pb-7">
          <div className="flex-1 shadow bg-white">
            <div className="flex flex-col">
              <span className="font-medium text-lg px-4 sm:px-8 py-4 border-b">
                My Wishlist ({wishlist?.length || 0})
              </span>

              {/* EMPTY STATE */}
              {!wishlist || wishlist.length === 0 ? (
                <div className="flex items-center flex-col gap-3 m-6">
                  <img
                    src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/mywishlist-empty_39f7a5.png"
                    className="object-contain"
                    alt="Empty Wishlist"
                  />
                  <span className="text-lg font-medium mt-6">
                    Empty Wishlist
                  </span>
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
