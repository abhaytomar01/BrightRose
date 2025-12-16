import { BsSearch } from "react-icons/bs";
import debounce from "lodash.debounce";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Search API call ---
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/api/v1/products/search/${encodeURIComponent(searchTerm)}`
      );

      const data = res.data?.products || [];
      setResults(data.slice(0, 8));
      setOpen(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setOpen(false);
    }
  };

  // --- Debounced search ---
  const debouncedSearch = useCallback(
    debounce(handleSearch, 350),
    []
  );

  // --- Cleanup debounce on unmount ---
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // --- Input handler ---
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // --- Enter key redirect ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full sm:w-[70%] relative flex flex-col items-center z-[999]"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#f0f5ff] relative w-full rounded-full overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#AD000F] transition-all"
      >
        <div className="flex items-center h-[42px] px-3">
          <BsSearch className="text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
            className="flex-1 bg-transparent outline-none px-3 text-[14px] md:text-[16px] text-gray-700 placeholder-gray-500"
          />
        </div>
      </form>

      {/* --- Dropdown results --- */}
      {open && results.length > 0 && (
        <ul
          className="absolute top-[46px] left-0 right-0 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-[1000]"
          style={{ maxHeight: "360px", overflowY: "auto" }}
        >
          {results.map((product) => (
            <li key={product._id}>
              <a
                href={`/product/${product._id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#f9f4f4] transition-colors"
                onClick={() => setOpen(false)}
              >
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md border border-gray-200"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {product.name?.length > 50
                      ? `${product.name.substring(0, 50)}…`
                      : product.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ₹
                    {(
                      product.discountPrice ||
                      product.price ||
                      0
                    ).toLocaleString()}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
