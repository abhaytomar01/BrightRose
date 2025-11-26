import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { Collapse } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";

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

  /* FILTER OPTIONS */
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

  /* PRICE HANDLER */
  const handlePriceChange = (_, newValue) => setTempPrice(newValue);

  useEffect(() => {
    const timer = setTimeout(() => setPrice(tempPrice), 300);
    return () => clearTimeout(timer);
  }, [tempPrice]);

  /* SECTION HEADER */
  const SectionHeader = ({ label, openState, setOpenState }) => (
    <div
      className="flex justify-between items-center py-3 cursor-pointer border-b border-[#eae6df]"
      onClick={() => setOpenState(!openState)}
    >
      <h3 className="text-[15px] font-semibold tracking-wide">{label}</h3>
      {openState ? (
        <ChevronDown className="w-5 h-5 rotate-180 text-gray-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-600" />
      )}
    </div>
  );

  /* OPTION UI */
  const Option = ({ text, isActive, onClick }) => (
    <li
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 rounded-md text-sm transition 
        ${
          isActive
            ? "bg-neutralDark/70 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {text}
    </li>
  );

  return (
    <aside className="w-full bg-white">

      {/* CATEGORY */}
      <SectionHeader label="Category" openState={openCategory} setOpenState={setOpenCategory} />
      <Collapse in={openCategory}>
        <ul className="py-2 space-y-1">
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
      <SectionHeader label="Weaves" openState={openWeaves} setOpenState={setOpenWeaves} />
      <Collapse in={openWeaves}>
        <ul className="py-2 space-y-1">
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
      <SectionHeader label="Style" openState={openStyle} setOpenState={setOpenStyle} />
      <Collapse in={openStyle}>
        <ul className="py-2 space-y-1">
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
      <SectionHeader label="Color" openState={openColor} setOpenState={setOpenColor} />
      <Collapse in={openColor}>
        <ul className="py-2 grid grid-cols-2 gap-2">
          {colors.map((col) => (
            <li
              key={col}
              onClick={() => setColor(col === "All" ? "" : col)}
              className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer transition 
              ${
                (!color && col === "All") || color === col
                  ? "bg-neutralDark/80 text-white"
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
      <SectionHeader label="Price" openState={openPrice} setOpenState={setOpenPrice} />
      <Collapse in={openPrice}>
        <div className="py-3">
          <div className="flex justify-between text-xs text-gray-700 mb-3">
            <div>
              <p className="text-[11px] text-gray-500">MIN</p>
              <p className="font-medium">₹{tempPrice[0]}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">MAX</p>
              <p className="font-medium">₹{tempPrice[1]}</p>
            </div>
          </div>

          <Slider
            value={tempPrice}
            onChange={handlePriceChange}
            min={0}
            max={10000}
            step={500}
            sx={{
              color: "#444444",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                backgroundColor: "#444444",
              },
            }}
          />
        </div>
      </Collapse>
    </aside>
  );
};

export default SideFilter;
