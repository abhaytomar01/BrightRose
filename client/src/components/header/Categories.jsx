import React from "react";

const categories = [
  { name: "New Arrivals", image: "/images/cat1.jpg" },
  { name: "Women", image: "/images/cat2.jpg" },
  { name: "Men", image: "/images/cat3.jpg" },
  { name: "Accessories", image: "/images/cat4.jpg" },
];

const Categories = () => {
  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      <h2 className="text-3xl font-semibold mb-10 text-center">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white text-lg font-semibold">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
