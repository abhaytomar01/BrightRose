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
    <div className="w-full bg-[#FCF7F1] flex flex-col items-center pb-16 pt-12 md:pt-16 px-2 sm:px-0 min-h-screen">
      {/* LOADING */}
      {loading ? (
        <Spinner />
      ) : products?.length === 0 ? (
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
              md:grid-cols-3
              lg:grid-cols-4
              gap-x-3
              gap-y-8
              w-full
              max-w-[1400px]
            "
          >
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* IMPORTANT: pass context */}
                <Product
                  {...product}
                  wishlistItems={wishlistItems}
                  setWishlistItems={setWishlistItems}
                  imageContext="listing"
                />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {productsCount > productsPerPage && (
            <div className="mt-12">
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
    </div>
  );
};

export default ProductListing;
