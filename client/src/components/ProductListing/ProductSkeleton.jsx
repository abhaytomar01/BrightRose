// src/components/ProductListing/ProductSkeleton.jsx
const ProductSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col rounded-lg overflow-hidden border border-neutral-100 bg-white">
      {/* Image placeholder */}
      <div className="w-full aspect-[4/5] bg-neutral-200 rounded-t-lg" />

      {/* Text placeholders */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-1/2" />
        <div className="h-4 bg-neutral-200 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
