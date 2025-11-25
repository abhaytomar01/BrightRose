import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import Product from "../../components/ProductListing/Product";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import axios from "axios";
import SeoData from "../../SEO/SeoData";
import SideFilter from "../../components/ProductListing/SideFilter";
import { useAuth } from "../../context/auth";

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
  const productsPerPage = 8;

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

  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <SeoData title="All Products | Bright Rose" />

      <main className="w-full pt-2 pb-5 mt-32 md:mt-36 bg-pureWhite">
        <div className="flex flex-col-reverse lg:flex-row gap-0 lg:gap-3 mt-2 w-full px-2 sm:px-4 md:px-6">

          {/* Sidebar */}
          <div className="w-full lg:w-[23%] lg:min-w-[320px] mb-4 lg:mb-0">
            
            {/* Mobile Filter Btn */}
            <div className="block lg:hidden">
              <button
                type="button"
                className="w-full text-left bg-primaryRed text-white rounded-lg p-2 mb-2 font-medium flex items-center justify-between border border-accentGold"
                onClick={() => setShowFilters(v => !v)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
                <span className="ml-2">{showFilters ? "▲" : "▼"}</span>
              </button>

              {showFilters && (
                <div className="bg-white rounded-lg shadow-md border border-mutedGray/60 py-3 px-4 mb-3">
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
              )}
            </div>

            {/* Desktop Filter */}
            <div className="hidden lg:block border border-mutedGray/60 rounded-lg p-4">
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

          {/* Products Section */}
          <div className="w-full lg:w-[77%] relative">

            {loading && <Spinner />}

            {/* If no products */}
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

            {/* Product Grid */}
            {!loading && products.length > 0 && (
              <div className="flex flex-col gap-4 pb-4 items-center bg-neutralLight rounded-lg border border-mutedGray/40 pt-4">

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-h-[350px]">
                  {currentProducts.map(product => (
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
                    className="my-4"
                  />
                )}

              </div>
            )}

          </div>
        </div>
      </main>
    </>
  );
};

export default Products;
