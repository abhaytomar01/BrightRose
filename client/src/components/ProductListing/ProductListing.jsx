/* eslint-disable react/prop-types */
import Product from "./Product";
import Spinner from "../Spinner";
import Pagination from "@mui/material/Pagination";

const ProductListing = ({
  loading,
  products,
  wishlistItems,
  setWishlistItems,
  currentPage,
  productsPerPage,
  productsCount,
  handlePageChange,
}) => {
  const totalPages = Math.ceil(productsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <>
    
    <div className="w-full bg-[#FCF7F1] flex flex-col items-center pb-16 pt-12 md:pt-16 px-2 sm:px-0 min-h-screen">

      {/* LOADING */}
      {loading ? (
        <Spinner />
      ) : products?.length === 0 ? (
        /* EMPTY STATE — LUXURY VERSION */
        <div className="flex flex-col items-center justify-center gap-5 mt-0 p-10 bg-white rounded-xl shadow-md border border-[#eadccc] max-w-lg text-center">
          <img
            draggable="false"
            className="w-52 opacity-80"
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
            alt="No Results"
          />
          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
            No products found
          </h1>
          <p className="text-gray-600 text-sm max-w-sm leading-relaxed">
            Try adjusting your filters or search with different keywords.
          </p>
        </div>
      ) : (
        <>

          {/* PRODUCT GRID */}
         <div
  className="
    grid 
    grid-cols-2 
    gap-x-2 
    gap-y-6
    w-full
  "
>

            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <Product
                  {...product}
                  wishlistItems={wishlistItems}
                  setWishlistItems={setWishlistItems}
                />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {productsCount > productsPerPage && (
            <div className="mt-10">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "14px",
                    borderRadius: "8px",
                    fontWeight: 600,
                  },
                }}
              />
            </div>
          )}
        </>
      )}
      {/* MOBILE FILTER / SORT BAR */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[999] flex md:hidden">
  
  <button
    className="flex-1 py-3 text-center font-medium text-[14px] border-r"
    onClick={() => setSortOpen(!sortOpen)}
  >
    SORT BY ▴
  </button>

  <button
    className="flex-1 py-3 text-center font-medium text-[14px]"
    onClick={() => setShowFilters(!showFilters)}
  >
    <span className="inline-flex items-center gap-1">
      <svg width="18" height="18" fill="currentColor"><path d="M3 5h14M6 10h10M10 15h6" stroke="currentColor" strokeWidth="2"/></svg>
      SHOW FILTERS
    </span>
  </button>
</div>

    </div>
    </>
  );
};

export default ProductListing;
