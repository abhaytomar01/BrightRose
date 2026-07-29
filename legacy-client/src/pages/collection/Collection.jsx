// client/src/pages/collection/Collection.jsx
import { useEffect, useState, useCallback } from "react";
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
  const currentPage = Number(searchParams.get("page")) || 1;
  const productsPerPage = 12;

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // 🧠 Smart Pagination
  const currentProducts = products.length > productsPerPage
    ? products.slice(startIndex, endIndex)
    : products;


  const fetchFiltered = async () => {
    try {
      setLoading(true);

      const params = {
        priceMin: price[0],
        priceMax: price[1],
        page: currentPage,
        limit: productsPerPage,
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

  // Fetch when filters or PAGE change
  useEffect(() => {
    fetchFiltered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, weave, style, set, category, currentPage]);

  const handleFilterChange = useCallback((setter, value) => {
    setter(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handlePriceChange = useCallback((newPrice) => {
    setPrice(newPrice);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handlePageChange = (_, page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", page.toString());
    setSearchParams(next);
  };

  return (
    <div className="flex w-full bg-[#FCF7F1] min-h-screen">
      {/* Sidebar filters (desktop) */}
      <div className="hidden md:block w-64 border-r bg-white">
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
        />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <ProductListing
          loading={loading}
          products={currentProducts}
          wishlistItems={[]}
          setWishlistItems={() => { }}
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
