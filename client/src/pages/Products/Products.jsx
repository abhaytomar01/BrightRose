import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import MinCategory from "../../components/MinCategory";
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

  // 🧭 Filter States
  const [price, setPrice] = useState([0, 10000]);
  const [debouncedPrice, setDebouncedPrice] = useState(price);
  const [category, setCategory] = useState(location.search ? location.search.split("=")[1] : "");
  const [ratings, setRatings] = useState(0);
  const [color, setColor] = useState("");
  // const [weave, setWeave] = useState("");
  // ✅ Detect "weave" query parameter if user comes from WeaveCollection
const queryParams = new URLSearchParams(location.search);
const initialWeave = queryParams.get("weave") || "";
const [weave, setWeave] = useState(initialWeave);

  const [style, setStyle] = useState("");
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sort, setSort] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);
  const productsPerPage = 8;
  const totalPages = Math.ceil(productsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(price);
    }, 400);
    return () => clearTimeout(handler);
  }, [price]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/filter`,
          {
            params: {
  category: category || undefined,
  weave: weave || undefined,
  style: style || undefined,
  color: color || undefined,
  priceMin: parseInt(debouncedPrice[0]),
  priceMax: parseInt(debouncedPrice[1]),
  ratings: ratings || undefined,
  sort,   // ⭐ Add sorting parameter
},

          }
        );
        if (res.data && res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
          setProductsCount(res.data.products.length);
        } else {
          setProducts([]);
          setProductsCount(0);
          toast.info("No products found for selected filters.", { toastId: "noProducts" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load products. Please try again later.", { toastId: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredData();
  }, [debouncedPrice, category, ratings, color, weave, style, sort]);

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
        toast.error("Error fetching wishlist items!", { toastId: "wishlistError" });
      }
    };
    if (auth?.token && !isAdmin) fetchWishlistItems();
  }, [auth?.token, isAdmin]);

  // Collapsible filter state
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <SeoData title="All Products | Bright Rose" />
      {/* <MinCategory /> */}

      <main className="w-full pt-2 pb-5 mt-24 md:mt-36">
        <div className="flex flex-col-reverse lg:flex-row gap-0 lg:gap-3 mt-2 m-auto w-full max-w-full px-2 sm:px-4 md:px-6">

          {/* Collapsible filter for mobile */}
          <div className="w-full lg:w-[23%] lg:min-w-[320px] mb-4 lg:mb-0">
            <div className="block lg:hidden">
              <button
                type="button"
                className="w-full text-left bg-[#AD000F] text-white rounded-lg p-2 mb-2 font-medium flex items-center justify-between"
                onClick={() => setShowFilters(v => !v)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
                <span className="ml-2">{ showFilters ? "▲" : "▼" }</span>
              </button>
              {showFilters && (
                <div className="bg-white rounded-lg shadow-md py-3 px-4 mb-3">
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
            <div className="hidden lg:block">
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

          <div className="flex justify-end mb-4">
  <select
    value={sort}
    onChange={e => setSort(e.target.value)}
    className="border border-gray-300 px-3 py-2 rounded-md text-sm"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="priceAsc">Price: Low to High</option>
    <option value="priceDesc">Price: High to Low</option>
  </select>
</div>


          {/* Products Grid */}
          <div className="w-full lg:w-[77%] relative">
            {loading && <Spinner />}

            {!loading && products?.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-12 sm:mt-16 md:mt-24 gap-3 bg-white shadow-sm rounded-sm py-10 px-4 sm:py-14 sm:px-8 min-h-[350px] sm:min-h-[400px]">
                <img
                  draggable="false"
                  className="w-2/3 sm:w-1/2 max-w-xs h-32 object-contain"
                  src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
                  alt="Search Not Found"
                />
                <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-1">Sorry, no results found!</h1>
                <p className="text-base sm:text-xl text-center text-primary-grey">
                  Please check the spelling or try searching for something else.
                </p>
              </div>
            )}

            {!loading && products?.length > 0 && (
              <div className="flex flex-col gap-4 pb-4 justify-center items-center w-full overflow-hidden bg-white">
                <div
                  className="
                    grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                    gap-4 sm:gap-6 w-full
                    place-content-start overflow-hidden pb-4
                    min-h-[350px] sm:min-h-[600px]
                  "
                >
                  {currentProducts.map((product) => (
                    <Product
                      key={product._id}
                      {...product}
                      wishlistItems={wishlistItems}
                      setWishlistItems={setWishlistItems}
                    />
                  ))}
                </div>
                {productsCount > productsPerPage && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </div>
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
