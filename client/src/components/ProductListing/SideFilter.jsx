import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { Collapse } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";

/*  
    LUXURY FILTER STYLING:
    - Minimal borders
    - Gold divider
    - Soft hover
    - Large spacing
    - Thin text
*/

const SideFilter = ({
  price = [0, 10000],
  setPrice,
  category = "",
  setCategory,
  color = "",
  setColor,
  weave = "",
  setWeave,
  style = "",
  setStyle,
}) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openWeaves, setOpenWeaves] = useState(false);
  const [openStyle, setOpenStyle] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openPrice, setOpenPrice] = useState(true);

  const [tempPrice, setTempPrice] = useState(price);

  /* Dropdown Options */
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

  /* Smooth price update */
  const handlePriceChange = (_, newValue) => {
    setTempPrice(newValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(price) !== JSON.stringify(tempPrice)) {
        setPrice(tempPrice);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [tempPrice]);

  /* Section header element */
  const SectionHeader = ({ label, openState, setOpenState }) => (
    <div
      className="flex justify-between items-center px-2 py-4 cursor-pointer border-b border-[#ece7df] hover:bg-[#f6f2ec] transition rounded-lg"
      onClick={() => setOpenState(!openState)}
    >
      <h3 className="text-[15px] font-medium tracking-wide text-gray-800">
        {label}
      </h3>

      {openState ? (
        <ChevronDown className="w-5 h-5 text-gray-600 transition-transform rotate-180" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-600" />
      )}
    </div>
  );

  /* Option Item */
  const Option = ({ text, isActive, onClick }) => (
    <li
      onClick={onClick}
      className={`cursor-pointer px-3 py-1.5 rounded-md text-sm transition-all 
      ${
        isActive
          ? "bg-[#AD000F] text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {text}
    </li>
  );

  return (
    <aside className="w-full bg-white border border-[#eae6df] rounded-2xl shadow-sm p-4">

      {/* CATEGORY */}
      <SectionHeader
        label="Category"
        openState={openCategory}
        setOpenState={setOpenCategory}
      />
      <Collapse in={openCategory}>
        <ul className="py-3 space-y-1">
          {categories.map((cat) => (
            <Option
              key={cat}
              text={cat}
              isActive={category === cat || (cat === "All" && category === "")}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
            />
          ))}
        </ul>
      </Collapse>

      {/* WEAVES */}
      <SectionHeader
        label="Weaves"
        openState={openWeaves}
        setOpenState={setOpenWeaves}
      />
      <Collapse in={openWeaves}>
        <ul className="py-3 space-y-1">
          {weavesSubcategories.map((w) => (
            <Option
              key={w}
              text={w}
              isActive={weave === w || (w === "All" && weave === "")}
              onClick={() => setWeave(w === "All" ? "" : w)}
            />
          ))}
        </ul>
      </Collapse>

      {/* STYLE */}
      <SectionHeader
        label="Style"
        openState={openStyle}
        setOpenState={setOpenStyle}
      />
      <Collapse in={openStyle}>
        <ul className="py-3 space-y-1">
          {styleSubcategories.map((sty) => (
            <Option
              key={sty}
              text={sty}
              isActive={style === sty || (sty === "All" && style === "")}
              onClick={() => setStyle(sty === "All" ? "" : sty)}
            />
          ))}
        </ul>
      </Collapse>

      {/* COLOR */}
      <SectionHeader
        label="Color"
        openState={openColor}
        setOpenState={setOpenColor}
      />
      <Collapse in={openColor}>
        <ul className="py-3 grid grid-cols-2 gap-2">
          {colors.map((col) => (
            <li
              key={col}
              onClick={() => setColor(col === "All" ? "" : col)}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer transition 
              ${
                (!color && col === "All") || color === col
                  ? "bg-[#AD000F] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {col !== "All" && (
                <span
                  className="w-4 h-4 mr-2 rounded-full border border-gray-300"
                  style={{ backgroundColor: col.toLowerCase() }}
                ></span>
              )}
              {col}
            </li>
          ))}
        </ul>
      </Collapse>

      {/* PRICE */}
      <SectionHeader
        label="Price"
        openState={openPrice}
        setOpenState={setOpenPrice}
      />
      <Collapse in={openPrice}>
        <div className="py-4">

          <div className="flex justify-between text-xs text-gray-600 mb-2 px-1">
            <div className="text-center">
              <p className="text-[11px] text-gray-500">MIN</p>
              <p className="font-medium">₹{tempPrice[0].toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-gray-500">MAX</p>
              <p className="font-medium">₹{tempPrice[1].toLocaleString()}</p>
            </div>
          </div>

          <Slider
            value={tempPrice}
            onChange={handlePriceChange}
            min={0}
            max={10000}
            step={500}
            sx={{
              color: "#AD000F",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                backgroundColor: "#AD000F",
              },
            }}
          />
        </div>
      </Collapse>
    </aside>
  );
};

export default SideFilter;
