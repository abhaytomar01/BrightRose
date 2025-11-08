import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const SideFilter = ({
  price = [0, 10000],
  setPrice,
  category = "",
  setCategory,
  ratings,
  setRatings,
  color = "",
  setColor,
  weave = "",
  setWeave,
  style = "",
  setStyle,
}) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openColor, setOpenColor] = useState(false);
  const [openPrice, setOpenPrice] = useState(true);
  const [openWeaves, setOpenWeaves] = useState(false);
  const [openStyle, setOpenStyle] = useState(false);

  const [tempPrice, setTempPrice] = useState(price);

  const categories = [
    "All",
    "Dresses",
    "Saree",
    "Coats & Blazers",
    "Skirts & Pants",
    "Corsets & Tops",
  ];

  const colors = [
    "All",
    "Red",
    "Blue",
    "Black",
    "White",
    "Green",
    "Beige",
    "Assorted",
  ];

  const weavesSubcategories = [
    "All",
    "Kanjeevaram",
    "Kantha",
    "Shibori",
    "Tanchoi",
    "Benarasi",
    "Kadwa",
    "Pochampally Ikat",
    "Gadwal",
    "Uppada",
    "Jamdani",
  ];

  const styleSubcategories = [
    "All",
    "Coats / Blazers",
    "Skirt & Pants",
    "Saree",
    "Dresses",
    "Corsets & Tops",
  ];

  // 🧩 Handle price slider smoothly
  const handlePriceChange = (e, newValue) => {
    setTempPrice(newValue);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (JSON.stringify(tempPrice) !== JSON.stringify(price)) {
        setPrice(tempPrice);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [tempPrice]);

  return (
    <aside className="w-80 bg-white border border-gray-200 rounded-xl shadow-sm p-4 transition-all duration-300">
      {/* CATEGORY */}
      <div
        className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition"
        onClick={() => setOpenCategory(!openCategory)}
      >
        <h3 className="font-semibold text-gray-900 text-base tracking-wide">
          Category  
        </h3>
        {openCategory ? (
          <ExpandMoreIcon className="text-gray-600 transition-transform rotate-180" />
        ) : (
          <ChevronRightIcon className="text-gray-600" />
        )}
      </div>
      <Collapse in={openCategory}>
        <ul className="pl-2 py-2 space-y-1">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => setCategory && setCategory(cat === "All" ? "" : cat)}
              className={`cursor-pointer py-1.5 px-2 rounded-md text-sm transition ${
                category === cat || (cat === "All" && category === "")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>
      </Collapse>

      {/* WEAVES SUBCATEGORIES */}
      <div
        className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition"
        onClick={() => setOpenWeaves(!openWeaves)}
      >
        <h3 className="font-semibold text-gray-900 text-base tracking-wide">
          Weaves
        </h3>
        {openWeaves ? (
          <ExpandMoreIcon className="text-gray-600 transition-transform rotate-180" />
        ) : (
          <ChevronRightIcon className="text-gray-600" />
        )}
      </div>
      <Collapse in={openWeaves}>
        <ul className="pl-2 py-2 space-y-1">
          {weavesSubcategories.map((wev) => (
            <li
              key={wev}
              onClick={() => setWeave && setWeave(wev === "All" ? "" : wev)}
              className={`cursor-pointer py-1.5 px-2 rounded-md text-sm transition ${
                weave === wev || (wev === "All" && weave === "")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {wev}
            </li>
          ))}
        </ul>
      </Collapse>

      {/* STYLE SUBCATEGORIES */}
      <div
        className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition"
        onClick={() => setOpenStyle(!openStyle)}
      >
        <h3 className="font-semibold text-gray-900 text-base tracking-wide">
          Style
        </h3>
        {openStyle ? (
          <ExpandMoreIcon className="text-gray-600 transition-transform rotate-180" />
        ) : (
          <ChevronRightIcon className="text-gray-600" />
        )}
      </div>
      <Collapse in={openStyle}>
        <ul className="pl-2 py-2 space-y-1">
          {styleSubcategories.map((sty) => (
            <li
              key={sty}
              onClick={() => setStyle && setStyle(sty === "All" ? "" : sty)}
              className={`cursor-pointer py-1.5 px-2 rounded-md text-sm transition ${
                style === sty || (sty === "All" && style === "")
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {sty}
            </li>
          ))}
        </ul>
      </Collapse>

      {/* COLOR */}
      <div
        className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition"
        onClick={() => setOpenColor(!openColor)}
      >
        <h3 className="font-semibold text-gray-900 text-base tracking-wide">
          Color
        </h3>
        {openColor ? (
          <ExpandMoreIcon className="text-gray-600 transition-transform rotate-180" />
        ) : (
          <ChevronRightIcon className="text-gray-600" />
        )}
      </div>
      <Collapse in={openColor}>
        <ul className="pl-2 py-3 grid grid-cols-2 gap-2">
          {colors.map((col) => (
            <li
              key={col}
              onClick={() => setColor && setColor(col === "All" ? "" : col)}
              className={`flex items-center gap-2 cursor-pointer text-sm rounded-md py-1 px-2 transition ${
                (col === "All" && !color) || color === col
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {col !== "All" && (
                <span
                  className="inline-block w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: col.toLowerCase() }}
                ></span>
              )}
              <span>{col}</span>
            </li>
          ))}
        </ul>
      </Collapse>

      {/* PRICE */}
      <div
        className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition"
        onClick={() => setOpenPrice(!openPrice)}
      >
        <h3 className="font-semibold text-gray-900 text-base tracking-wide">
          Price
        </h3>
        {openPrice ? (
          <ExpandMoreIcon className="text-gray-600 transition-transform rotate-180" />
        ) : (
          <ChevronRightIcon className="text-gray-600" />
        )}
      </div>
      <Collapse in={openPrice}>
        <div className="py-4 px-2">
          <div className="flex justify-between text-xs font-medium mb-2 text-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-[11px]">MIN</span>
              <span>₹{tempPrice?.[0]?.toLocaleString() ?? 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-[11px]">MAX</span>
              <span>₹{tempPrice?.[1]?.toLocaleString() ?? 0}</span>
            </div>
          </div>

          <Slider
            value={tempPrice}
            onChange={handlePriceChange}
            valueLabelDisplay="off"
            min={0}
            max={10000}
            step={1000}
            sx={{
              color: "#000",
              height: 4,
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#000",
                "&:hover": { boxShadow: "0 0 0 8px rgba(0,0,0,0.16)" },
              },
            }}
          />
        </div>
      </Collapse>
    </aside>
  );
};

export default SideFilter;
