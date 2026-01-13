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
  const [price, setPrice] = useState([0, 100000]);
  const [debouncedPrice, setDebouncedPrice] = useState(price);

  const [category, setCategory] = useState(
    location.search ? location.search.split("=")[1] : ""
  );

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedPrice, category, weave, style]);

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
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products`
        );
        setProducts(res.data.products || []);
        setProductsCount(res.data.products?.length || 0);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Load FILTERED PRODUCTS only when filters change
  useEffect(() => {
    // Check if any filter is active
    const filterIsActive =
      category ||
      weave ||
      style ||
      debouncedPrice[0] !== 0 ||
      debouncedPrice[1] !== 100000;

    if (!filterIsActive) {
      // If no filter is active, fetch all products again
      const fetchAllProducts = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/products`
          );
          setProducts(res.data.products || []);
          setProductsCount(res.data.products?.length || 0);
        } catch (error) {
          console.error("Failed to load products:", error);
          toast.error("Failed to load products.");
        } finally {
          setLoading(false);
        }
      };
      fetchAllProducts();
      return;
    }

    // If filter is active, fetch filtered products
    const fetchFiltered = async () => {
      try {
        setLoading(true);

        // Build query params - MATCHING BACKEND EXPECTATIONS
        const params = {};

        if (category) params.category = category;

        // ✅ FIXED: Send as weavingSlug not weave
        if (weave) params.weavingSlug = weave;

        // ✅ FIXED: Send as tagSlugs not style
        if (style) params.tagSlugs = style;

        params.priceMin = debouncedPrice[0];
        params.priceMax = debouncedPrice[1];

        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/filter`,
          { params }
        );

        setProducts(res.data.products || []);
        setProductsCount(res.data.products?.length || 0);
      } catch (error) {
        console.error("Error loading filtered products:", error);
        toast.error("Failed to load filtered products.");
        setProducts([]);
        setProductsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [debouncedPrice, category, weave, style]);

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
        console.error("Error fetching wishlist:", error);
        toast.error("Error fetching wishlist!");
      }
    };

    if (auth?.token && !isAdmin) fetchWishlistItems();
  }, [auth?.token, isAdmin]);

  // Mobile Filter Popup
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Reset all filters function
  const handleResetFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setWeave("");
    setStyle("");
    setCurrentPage(1);
    toast.success("Filters reset!");
  };

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
              className="text-lg font-semibold cursor-pointer hover:opacity-70"
            >
              ✕
            </button>
          </div>

          {/* Full Screen SideFilter */}
          <SideFilter
            price={price}
            category={category}
            setPrice={setPrice}
            setCategory={setCategory}
            weave={weave}
            setWeave={setWeave}
            style={style}
            setStyle={setStyle}
          />

          {/* Reset & Apply Buttons */}
          <div className="flex gap-2 mt-5">
            <button
              className="flex-1 bg-gray-200 text-black text-center py-4 rounded-lg text-sm tracking-wide font-medium hover:bg-gray-300 transition"
              onClick={() => {
                handleResetFilters();
                setShowFilterPopup(false);
              }}
            >
              RESET FILTERS
            </button>
            <button
              className="flex-1 bg-black text-white text-center py-4 rounded-lg text-sm tracking-wide font-medium hover:bg-gray-800 transition"
              onClick={() => setShowFilterPopup(false)}
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      )}

      <main className="w-full pt-2 pb-5 mt-24 md:mt-28 bg-pureWhite">
        <div className="flex flex-col-reverse lg:flex-row gap-3 w-full px-2 sm:px-4 md:px-6 mt-2 md:mt-4">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-[23%] min-w-[280px]">
            <div className="border border-mutedGray/60 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer transition"
                >
                  Reset All
                </button>
              </div>
              <SideFilter
                price={price}
                category={category}
                setPrice={setPrice}
                setCategory={setCategory}
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
                  alt="No results found"
                />
                <h1 className="text-xl font-light text-primaryRed">
                  Sorry, no results found!
                </h1>
                <p className="text-base text-center text-neutralDark/70">
                  Try selecting different filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full place-content-start">
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
                  <div className="flex justify-center mt-8">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      color="primary"
                      size="large"
                    />
                  </div>
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
          className="flex items-center gap-2 text-lg font-medium tracking-wider cursor-pointer hover:opacity-70 transition"
        >
          <SlidersHorizontal size={20} />
          SHOW FILTERS
        </button>
      </div>
    </>
  );
};

export default Products;
