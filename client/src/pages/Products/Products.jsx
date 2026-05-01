// src/pages/products/Products.jsx
import Pagination from "@mui/material/Pagination";
import { useState, useEffect, useCallback, useRef } from "react";
import Product from "../../components/ProductListing/Product";
import { useLocation, useSearchParams } from "react-router-dom";
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

  const [searchParamsState, setSearchParamsState] = useSearchParams();

  // --- read all query params ONCE for initial state ---
  const initialCategory = searchParamsState.get("category") || "";
  const initialWeave = searchParamsState.get("weave") || "";
  const initialStyle = searchParamsState.get("style") || "";
  const initialSet = searchParamsState.get("set") || "";       // 👈 NEW
  const initialSize = searchParamsState.get("size") || "";     // 👈 NEW
  const initialColor = searchParamsState.get("color") || "";   // 👈 NEW
  const initialPriceMin = searchParamsState.get("priceMin");
  const initialPriceMax = searchParamsState.get("priceMax");
  const initialPage = Number(searchParamsState.get("page")) || 1;

  // Filters - ADDED size/color states 👇
  const [price, setPrice] = useState([
    initialPriceMin ? Number(initialPriceMin) : 0,
    initialPriceMax ? Number(initialPriceMax) : 200000,
  ]);
  const [debouncedPrice, setDebouncedPrice] = useState(price);

  const [category, setCategory] = useState(initialCategory);
  const [weave, setWeave] = useState(initialWeave);
  const [style, setStyle] = useState(initialStyle);
  const [set, setSet] = useState(initialSet);       // 👈 NEW
  const [size, setSize] = useState(initialSize);     // 👈 NEW
  const [color, setColor] = useState(initialColor);  // 👈 NEW

  // Product Data
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);

  // Wishlist
  const [wishlistItems, setWishlistItems] = useState([]);

  // Pagination (Derived from URL)
  const currentPage = Number(searchParamsState.get("page")) || 1;
  const productsPerPage = 16;

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // 🧠 Smart Pagination: 
  // If server returns more than we asked for, it means it didn't paginate. 
  // So we slice on client. Otherwise, use as-is.
  const currentProducts = products.length > productsPerPage
    ? products.slice(startIndex, endIndex)
    : products;

  const totalPages = Math.ceil(productsCount / productsPerPage);


  // 🔹 Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth" if you prefer
    });
  }, [currentPage]);


  // Helper to update filter state AND reset URL page to 1
  const handleFilterChange = useCallback((setter, value) => {
    setter(value);
    setSearchParamsState((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    }, { replace: true });
  }, [setSearchParamsState]);

  // Helper for price specifically (since it's an array)
  const handlePriceChange = useCallback((newPrice) => {
    setPrice(newPrice);
    setSearchParamsState((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    }, { replace: true });
  }, [setSearchParamsState]);

  // Debounce price
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedPrice(price), 400);
    return () => clearTimeout(handler);
  }, [price]);

  // 🔥 NEW: Unified fetch function that handles ALL filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Check if NO filters active → fetch ALL products
      const filterIsActive =
        category || weave || style || set || size || color ||  // 👈 ADDED set, size/color
        debouncedPrice[0] !== 0 ||
        debouncedPrice[1] !== 200000;

      if (!filterIsActive) {
        // Fetch ALL products
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products`,
          { params: { page: currentPage, limit: productsPerPage } }
        );
        setProducts(res.data.products || []);
        setProductsCount(res.data.count ?? (res.data.products?.length || 0));
        return;
      }

      // Fetch FILTERED products
      const params = {
        category: category || "",
        weavingSlug: weave || "",
        tagSlugs: style || set || "", // Use either style or set
        size: size || "",        // 👈 NEW
        color: color || "",      // 👈 NEW
        priceMin: debouncedPrice[0],
        priceMax: debouncedPrice[1],
        page: currentPage, // 👈 Pass current page to API
        limit: productsPerPage,
      };

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/filter`,
        { params }
      );

      setProducts(res.data.products || []);
      setProductsCount(res.data.count ?? (res.data.products?.length || 0));
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products.");
      setProducts([]);
      setProductsCount(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedPrice[0], debouncedPrice[1], category, weave, style, set, size, color, currentPage]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load Wishlist (unchanged)
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

  // Reset ALL filters function - UPDATED 👇
  const handleResetFilters = () => {
    setPrice([0, 200000]);
    setCategory("");
    setWeave("");
    setStyle("");
    setSet("");      // 👈 NEW
    setSize("");     // 👈 NEW
    setColor("");    // 👈 NEW
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

      {/* FULL SCREEN MOBILE FILTER OVERLAY - UPDATED SideFilter props 👇 */}
      {/* // 🔥 UPDATED: Mobile Filter Popup with auto-close callback */}
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

          {/* 🔥 SideFilter with wrapped handlers to reset page */}
          <SideFilter
            price={price}
            setPrice={handlePriceChange}
            category={category}
            setCategory={(v) => handleFilterChange(setCategory, v)}
            weave={weave}
            setWeave={(v) => handleFilterChange(setWeave, v)}
            style={style}
            setStyle={(v) => handleFilterChange(setStyle, v)}
            set={set}
            setSet={(v) => handleFilterChange(setSet, v)}
            size={size}
            setSize={(v) => handleFilterChange(setSize, v)}
            color={color}
            setColor={(v) => handleFilterChange(setColor, v)}
            // 🔥 NEW: Auto-close callback
            onFilterApply={(filterType) => {
              setShowFilterPopup(false);
            }}
          />

          {/* Reset Button - Also auto-closes */}
          <div className="flex gap-2 mt-5">
            <button
              className="flex-1 bg-gray-200 text-black text-center py-4 rounded-lg text-sm tracking-wide font-medium hover:bg-gray-300 transition"
              onClick={() => {
                handleResetFilters();
                setShowFilterPopup(false); // 🔥 AUTO-CLOSE
              }}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
      )}


      <main className="w-full pt-2 pb-5 mt-16 md:mt-16 bg-pureWhite">
        <div className="flex flex-col-reverse lg:flex-row gap-3 w-full px-2 sm:px-4 md:px-6 mt-2 md:mt-4">
          {/* Desktop Sidebar Filter - ALL PROPS 👇 */}
          <div className="hidden lg:block w-[23%] min-w-[280px]">
            <div className="border border-mutedGray/60 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-neutralDark/60 hover:text-neutralDark/80 font-medium underline cursor-pointer transition"
                >
                  Reset All
                </button>
              </div>
              <SideFilter
                price={price}
                setPrice={handlePriceChange}
                category={category}
                setCategory={(v) => handleFilterChange(setCategory, v)}
                weave={weave}
                setWeave={(v) => handleFilterChange(setWeave, v)}
                style={style}
                setStyle={(v) => handleFilterChange(setStyle, v)}
                set={set}
                setSet={(v) => handleFilterChange(setSet, v)}
                size={size}
                setSize={(v) => handleFilterChange(setSize, v)}
                color={color}
                setColor={(v) => handleFilterChange(setColor, v)}
              />
            </div>
          </div>

          {/* Product Grid - UNCHANGED */}
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
                        const next = new URLSearchParams(searchParamsState);
                        next.set("page", page.toString());
                        setSearchParamsState(next);
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

      {/* MOBILE STICKY FILTER BUTTON - UNCHANGED */}
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
