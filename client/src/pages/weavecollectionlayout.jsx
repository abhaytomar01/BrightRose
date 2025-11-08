import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Filter, X, Search } from "lucide-react";

const allProducts = [
  {
    id: 1,
    name: "Hand-woven Silk Blazer",
    fabric: "Silk",
    color: "Beige",
    price: 8499,
    image:
      "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Heritage Cotton Jacket",
    fabric: "Cotton",
    color: "Navy",
    price: 6999,
    image:
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Khadi Thread Overcoat",
    fabric: "Khadi",
    color: "Brown",
    price: 7899,
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Linen Luxury Blazer",
    fabric: "Linen",
    color: "Ivory",
    price: 9299,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Wool Weave Overcoat",
    fabric: "Wool",
    color: "Gray",
    price: 10499,
    image:
      "https://images.unsplash.com/photo-1606813902779-63e39ec0b8c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Raw Khadi Blend Coat",
    fabric: "Khadi",
    color: "Cream",
    price: 7999,
    image:
      "https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=800&q=80",
  },
];

const WeaveCollection = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [loadingProductId, setLoadingProductId] = useState(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFabric = selectedFabric === "All" || p.fabric === selectedFabric;
      return matchesSearch && matchesFabric;
    });

    if (sortBy === "lowToHigh") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "highToLow") filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [searchQuery, selectedFabric, sortBy]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Add to Cart Functionality
  const handleAddToCart = async (product) => {
    try {
      setLoadingProductId(product.id);

      const token = localStorage.getItem("token"); // if user is logged in

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/cart/add`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
  userId: "12345",  // 👈 temporary fix, replace with real user ID
  productId: product.id,
  quantity: 1,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      alert(`✅ ${product.name} added to cart successfully!`);
    } catch (error) {
      console.error(error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="bg-[#F8F6F3] text-[#222]">
      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1600&q=80"
          alt="Weave Collection Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-serif tracking-wide mb-4 text-white">
            The Weave Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto">
            Handwoven Indian heritage. Redefined for modern luxury.
          </p>
        </motion.div>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-wrap items-center justify-between px-6 md:px-16 py-4 border-b border-gray-300 bg-white sticky top-0 z-30">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 text-sm font-medium hover:text-[#AD000F]"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>

        <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm px-2 w-32 md:w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-1.5 bg-white focus:outline-none text-sm"
        >
          <option value="featured">Sort by Featured</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </section>

      {/* FILTER SIDEBAR */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setFilterOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 100 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-lg p-6 overflow-y-auto"
            >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Fabric</h3>
                {["All", "Silk", "Cotton", "Khadi", "Linen", "Wool"].map((f) => (
                  <label
                    key={f}
                    className="flex items-center gap-2 text-sm mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={selectedFabric === f}
                      onChange={() => setSelectedFabric(f)}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRODUCTS GRID */}
      <section className="px-6 md:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 bg-white/70 p-2 rounded-full transition ${
                    wishlist.includes(product.id)
                      ? "text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-medium mb-2 group-hover:text-[#AD000F] transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-700 font-semibold mb-4">₹{product.price}</p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={loadingProductId === product.id}
                  onClick={() => handleAddToCart(product)}
                  className={`${
                    loadingProductId === product.id
                      ? "bg-gray-400"
                      : "bg-[#AD000F] hover:bg-[#90000D]"
                  } text-white px-6 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-all`}
                >
                  {loadingProductId === product.id ? "Adding..." : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </section>
    </div>
  );
};

export default WeaveCollection;
