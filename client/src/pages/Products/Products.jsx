import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import Product from "../../components/ProductListing/Product";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import axios from "axios";
import SideFilter from "../../components/ProductListing/SideFilter";
import { useAuth } from "../../context/auth";
import { SlidersHorizontal } from "lucide-react";
import SeoData from "../../SEO/SeoData.jsx";

const Products = () => {
  const location = useLocation();
  const { auth, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);

  // Filters
  const [price, setPrice] = useState([0, 10000]);
  const [debouncedPrice, setDebouncedPrice] = useState(price);

  const [category, setCategory] = useState(location.search ? location.search.split("=")[1] : "");
  const [ratings, setRatings] = useState(0);
  const [color, setColor] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const initialWeave = queryParams.get("weave") || "";
  const [weave, setWeave] = useState(initialWeave);

  const [style, setStyle] = useState("");

  // Product Data
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);

  // Wishlist
  const [wishlistItems, setWishlistItems] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(productsCount / productsPerPage);

  // Debounce price
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedPrice(price), 400);
    return () => clearTimeout(handler);
  }, [price]);

  // Load ALL PRODUCTS initially
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/products`);
        setProducts(res.data.products);
        setProductsCount(res.data.products.length);
      } catch (error) {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Load FILTERED PRODUCTS only when filters change
  useEffect(() => {
    const filterIsActive =
      category ||
      weave ||
      style ||
      color ||
      ratings !== 0 ||
      debouncedPrice[0] !== 0 ||
      debouncedPrice[1] !== 10000;

    if (!filterIsActive) return;

    const fetchFiltered = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/filter`,
          {
            params: {
              category,
              weave,
              style,
              color,
              ratings,
              priceMin: debouncedPrice[0],
              priceMax: debouncedPrice[1],
            },
          }
        );

        setProducts(res.data.products);
        setProductsCount(res.data.products.length);
      } catch (error) {
        toast.error("Failed to load filtered products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [debouncedPrice, category, ratings, color, weave, style]);

  // Load Wishlist
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/wishlist`,
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        setWishlistItems(res.data.wishlistItems || []);
      } catch (error) {
        toast.error("Error fetching wishlist!");
      }
    };

    if (auth?.token && !isAdmin) fetchWishlistItems();
  }, [auth?.token, isAdmin]);

  // NEW → Mobile Filter Popup
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  return (
    <>
      <SeoData
  title="Shop All Products – Bright Rose Luxury Handloom Couture"
  description="Explore the full collection of handcrafted luxury from Bright Rose. Kanchipuram silk jackets, capes, dress sets, and artisanal couture."
  keywords={[
    "shop handloom fashion",
    "kanchipuram jackets",
    "luxury couture india",
    "handwoven designer wear",
  ]}
  image="/og-products.jpg"
  url="/products"
/>

      {/* FULL SCREEN MOBILE FILTER OVERLAY */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto p-5 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilterPopup(false)}
              className="text-lg font-semibold"
            >
              ✕
            </button>
          </div>

          {/* Full Screen SideFilter */}
          <SideFilter
            price={price}
            category={category}
            ratings={ratings}
            setPrice={setPrice}
            setCategory={setCategory}
            setRatings={setRatings}
            color={color}
            setColor={setColor}
            weave={weave}
            setWeave={setWeave}
            style={style}
            setStyle={setStyle}
          />

          {/* Apply Button */}
          <button
            className="w-full mt-5 bg-black text-white text-center py-4 rounded-lg text-sm tracking-wide"
            onClick={() => setShowFilterPopup(false)}
          >
            APPLY FILTERS
          </button>
        </div>
      )}

      <main className="w-full pt-2 pb-5 mt-32 md:mt-36 bg-pureWhite">
        <div className="flex flex-col-reverse lg:flex-row gap-3 w-full px-2 sm:px-4 md:px-6 mt-2 md:mt-4">

          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-[23%] min-w-[280px]">
            <div className="border border-mutedGray/60 rounded-lg p-4">
              <SideFilter
                price={price}
                category={category}
                ratings={ratings}
                setPrice={setPrice}
                setCategory={setCategory}
                setRatings={setRatings}
                color={color}
                setColor={setColor}
                weave={weave}
                setWeave={setWeave}
                style={style}
                setStyle={setStyle}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-[77%] relative">

            {loading && <Spinner />}

            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-12 gap-3 bg-neutralLight shadow-sm rounded-lg py-10 px-4 border border-mutedGray/60">
                <img
                  className="w-40 h-32 object-contain"
                  src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
                />
                <h1 className="text-xl font-light text-primaryRed">
                  Sorry, no results found!
                </h1>
                <p className="text-base text-center text-neutralDark/70">
                  Try selecting different filters.
                </p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <>
                <div className="
                  grid 
                  grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-4 
                  gap-4 
                  w-full
                  place-content-start
                ">
                  {currentProducts.map((product) => (
                    <Product
                      key={product._id}
                      {...product}
                      wishlistItems={wishlistItems}
                      setWishlistItems={setWishlistItems}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {productsCount > productsPerPage && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    className="my-6"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE STICKY FILTER BUTTON */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t z-[999] py-3 px-6 flex items-center justify-center shadow-md">
        <button
          onClick={() => setShowFilterPopup(true)}
          className="flex items-center gap-2 text-lg font-medium tracking-wider"
        >
          <SlidersHorizontal size={20} />
          SHOW FILTERS
        </button>
      </div>
    </>
  );
};

export default Products;
