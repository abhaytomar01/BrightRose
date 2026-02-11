import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { Collapse } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";

const slugify = (v) =>
  v.toLowerCase().replace(/\s*&\s*|\s*\/\s*/g, "-").replace(/\s+/g, "-");

const SideFilter = ({
  price,
  setPrice,
  category,
  setCategory,
  weave,
  setWeave,
  style,
  setStyle,
  size,
  setSize,
  color,
  setColor,
  // 🔥 NEW: onFilterApply callback for mobile auto-close
  onFilterApply,
}) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openWeaves, setOpenWeaves] = useState(false);
  const [openStyle, setOpenStyle] = useState(false);
  const [openPrice, setOpenPrice] = useState(true);
  const [openSize, setOpenSize] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const [tempPrice, setTempPrice] = useState(price);

  /* OPTIONS - UNCHANGED */
  const categories = ["All"];
  const weavesSubcategories = [
    "All",
    "kanchipuram",
    "banarasi",
    "pashmina",
    "plain",
    "kantha",
    "pochampalley",
    "narayanpet",
  ];
  const styleSubcategories = [
    "All",
    "sarees",
    "dresses",
    "blazers",
    "skirt",
    "pants",
    "corsets",
    "tops",
    "jacket",
    "shirt",
  ];
  const sizeOptions = [
    "All",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "Free Size",
  ];
  const colorOptions = [
    "All",
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Pink",
    "Yellow",
    "Purple",
    "Maroon",
    "Gold",
    "Ivory",
    "Grey",
  ];

  const displayWeave = (slug) =>
    slug === "All" ? "All" : slug.charAt(0).toUpperCase() + slug.slice(1);
  const displayStyle = (slug) =>
    slug === "All" ? "All" : slug.charAt(0).toUpperCase() + slug.slice(1);
  const displaySize = (s) => (s === "All" ? "All Sizes" : s);
  const displayColor = (c) => (c === "All" ? "All Colors" : c);

  useEffect(() => {
    const t = setTimeout(() => setPrice(tempPrice), 300);
    return () => clearTimeout(t);
  }, [tempPrice, setPrice]);

  // 🔥 NEW: Auto-close handler for mobile
  const handleFilterApply = (filterType) => {
    if (onFilterApply) {
      onFilterApply(filterType);
    }
  };

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

  const Option = ({ text, isActive, onClick, filterType }) => (
    <li
      onClick={() => {
        onClick();
        // 🔥 AUTO-CLOSE ON MOBILE when filter applied
        handleFilterApply(filterType);
      }}
      className={`cursor-pointer px-3 py-2 rounded-md text-sm transition 
        ${
          isActive
            ? "bg-neutral-800 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {text}
    </li>
  );

  return (
    <aside className="w-full bg-white">
      {/* CATEGORY */}
      <SectionHeader
        label="Category"
        openState={openCategory}
        setOpenState={setOpenCategory}
      />
      <Collapse in={openCategory}>
        <ul className="py-2 space-y-1">
          {categories.map((cat) => (
            <Option
              key={cat}
              text={cat}
              isActive={category === slugify(cat) || (cat === "All" && !category)}
              onClick={() => setCategory(cat === "All" ? "" : slugify(cat))}
              filterType="category"
            />
          ))}
        </ul>
      </Collapse>

      {/* WEAVES - 🔥 AUTO-CLOSE ADDED */}
      <SectionHeader
        label="Weave"
        openState={openWeaves}
        setOpenState={setOpenWeaves}
      />
      <Collapse in={openWeaves}>
        <ul className="py-2 space-y-1">
          {weavesSubcategories.map((w) => (
            <Option
              key={w}
              text={displayWeave(w)}
              isActive={weave === w || (w === "All" && !weave)}
              onClick={() => {
                if (w === "All") {
                  setWeave("");
                } else {
                  setWeave(w);
                  setStyle("");
                }
              }}
              filterType="weave"
            />
          ))}
        </ul>
      </Collapse>

      {/* STYLE - 🔥 AUTO-CLOSE ADDED */}
      <SectionHeader
        label="Style"
        openState={openStyle}
        setOpenState={setOpenStyle}
      />
      <Collapse in={openStyle}>
        <ul className="py-2 space-y-1">
          {styleSubcategories.map((s) => (
            <Option
              key={s}
              text={displayStyle(s)}
              isActive={style === s || (s === "All" && !style)}
              onClick={() => {
                if (s === "All") {
                  setStyle("");
                } else {
                  setStyle(s);
                  setWeave("");
                }
              }}
              filterType="style"
            />
          ))}
        </ul>
      </Collapse>

      {/* SIZE - 🔥 AUTO-CLOSE ADDED */}
      <SectionHeader
        label="Size"
        openState={openSize}
        setOpenState={setOpenSize}
      />
      <Collapse in={openSize}>
        <ul className="py-2 space-y-1">
          {sizeOptions.map((sz) => (
            <Option
              key={sz}
              text={displaySize(sz)}
              isActive={size === sz || (sz === "All" && !size)}
              onClick={() => setSize(sz === "All" ? "" : sz)}
              filterType="size"
            />
          ))}
        </ul>
      </Collapse>

      {/* COLOR - 🔥 AUTO-CLOSE ADDED */}
      <SectionHeader
        label="Color"
        openState={openColor}
        setOpenState={setOpenColor}
      />
      <Collapse in={openColor}>
        <ul className="py-2 space-y-1">
          {colorOptions.map((c) => (
            <Option
              key={c}
              text={displayColor(c)}
              isActive={color === c || (c === "All" && !color)}
              onClick={() => setColor(c === "All" ? "" : c)}
              filterType="color"
            />
          ))}
        </ul>
      </Collapse>

      {/* PRICE - 🔥 AUTO-CLOSE ON PRICE CHANGE */}
      <SectionHeader
        label="Price"
        openState={openPrice}
        setOpenState={setOpenPrice}
      />
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
            onChange={(_, v) => {
              setTempPrice(v);
              // 🔥 AUTO-CLOSE ON PRICE DRAG (with small delay)
              setTimeout(() => handleFilterApply("price"), 500);
            }}
            min={0}
            max={200000}
            step={1000}
            sx={{
              color: "#444",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                backgroundColor: "#444",
              },
            }}
          />
        </div>
      </Collapse>
    </aside>
  );
};

export default SideFilter;
