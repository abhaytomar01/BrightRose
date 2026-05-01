// client/src/pages/collection/Collection.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SideFilter from "../../components/ProductListing/SideFilter";
import ProductListing from "../../components/ProductListing/ProductListing";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // filters
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [weave, setWeave] = useState("");
  const [style, setStyle] = useState("");
  const [set, setSet] = useState(""); // 👈 NEW

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;

  // pagination (frontend slice)
  const [currentPage, setCurrentPage] = useState(initialPage);
  const productsPerPage = 12;

  // 🔹 Sync currentPage with URL (for back/forward buttons)
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams, currentPage]);

  const fetchFiltered = async () => {
    try {
      setLoading(true);

      const params = {
  priceMin: price[0],
  priceMax: price[1],
};
if (weave) params.weavingSlug = weave;
if (style || set) params.tagSlugs = style || set;
if (category) params.category = category;


      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/filter`,
        { params }
      );

      if (res.data?.success !== false) {
        // assume backend returns array in res.data.products
        setProducts(res.data.products || []);
        // if backend uses a 'count' field use that, otherwise length
        setProductsCount(res.data.count ?? (res.data.products?.length || 0));
        setCurrentPage(1);
      } else {
        setProducts([]);
        setProductsCount(0);
      }
    } catch (err) {
      console.error("FILTER FETCH ERROR:", err);
      setProducts([]);
      setProductsCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change
  useEffect(() => {
    fetchFiltered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, weave, style, set, category]);

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", page.toString());
      return next;
    });
  };

  return (
    <div className="flex w-full bg-[#FCF7F1] min-h-screen">
      {/* Sidebar filters (desktop) */}
      <div className="hidden md:block w-64 border-r bg-white">
        <SideFilter
          price={price}
          setPrice={setPrice}
          category={category}
          setCategory={setCategory}
          weave={weave}
          setWeave={setWeave}
          style={style}
          setStyle={setStyle}
          set={set}             // 👈 NEW
          setSet={setSet}       // 👈 NEW
        />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <ProductListing
          loading={loading}
          products={products}
          wishlistItems={[]}
          setWishlistItems={() => {}}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          productsCount={productsCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Collection;
