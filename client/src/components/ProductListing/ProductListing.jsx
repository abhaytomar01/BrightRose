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
    <div className="flex flex-col gap-2 pb-4 justify-center items-center w-full overflow-hidden bg-[#FCF7F1]">
      {loading ? (
        <Spinner />
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-start mt-24 md:mt-32 gap-3 bg-[#FCF7F1] shadow-sm rounded-sm p-6 sm:p-16 sm:min-h-[750px] ">
          <img
            draggable="true"
            className="w-1/2 h-44 object-contain"
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
            alt="Search Not Found"
          />
          <h1 className="text-2xl font-medium text-gray-900">
            Sorry, no results found!
          </h1>
          <p className="text-xl text-center text-primary-grey">
            Please check the spelling or try searching for something else.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 w-full place-content-start overflow-hidden pb-4 min-h-[750px] ">
            {currentProducts?.map((product) => (
              <Product
                key={product._id}
                {...product}
                wishlistItems={wishlistItems}
                setWishlistItems={setWishlistItems}
              />
            ))}
          </div>

          {productsCount > productsPerPage && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductListing;
