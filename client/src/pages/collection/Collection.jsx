// client/src/pages/collection/Collection.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SideFilter from "../../components/ProductListing/SideFilter";
import ProductListing from "../../components/ProductListing/ProductListing";
import Spinner from "../../components/Spinner";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // filters
  const [price, setPrice] = useState([0, 10000]);
  const [category, setCategory] = useState("");
  const [weave, setWeave] = useState("");
  const [style, setStyle] = useState("");

  // pagination (frontend slice)
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const fetchFiltered = async () => {
    try {
      setLoading(true);

      const params = {
        priceMin: price[0],
        priceMax: price[1],
      };
      if (weave) params.weave = weave;
      if (style) params.style = style;
      // category reserved: if backend added later, just add params.category

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/filter`,
        { params }
      );

      if (res.data?.success) {
        setProducts(res.data.products || []);
        setProductsCount(res.data.count || 0);
        setCurrentPage(1); // reset to first page on every filter change
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
  }, [price, weave, style]);

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
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
