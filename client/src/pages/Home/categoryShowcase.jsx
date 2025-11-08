import React from "react";

// Default categories (can override via props)
const defaultCategories = [
  { name: "Shrug Set", img: "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg" },
  { name: "Sherwani", img: "https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg" },
  { name: "Short Jacket", img: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg" },
  { name: "Long Bandhgala", img: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg" },
];

export default function CategoryShowcase({ categories = defaultCategories }) {
  return (
    <section className="w-full py-14 px-5 md:px-20">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold">EXCLUSIVE SEASONAL SHOWCASE</h1>
        <p className="text-md font-semibold">Crafting Timeless Luxury, Season After Season</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href="#"
            className="group overflow-hidden bg-white shadow transition duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center"
            style={{ minHeight: 320 }}
          >
            <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center overflow-hidden rounded">
  <img
    src={cat.img}
    alt={cat.name}
    className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
    draggable={false}
  />
</div>
            <div className="py-5 w-full text-center">
              <span className="block text-lg md:text-xl font-extrabold uppercase tracking-wide text-gray-800">{cat.name}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
