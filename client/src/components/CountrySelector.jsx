// src/components/CountrySelector.jsx
import React, { useEffect, useState } from "react";
import COUNTRIES from "./data/countries"; // create this file below

const CountrySelector = ({ value, onChange, className = "" }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(COUNTRIES);

  useEffect(() => {
    if (!query) return setFiltered(COUNTRIES);
    const q = query.toLowerCase();
    setFiltered(
      COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.native && c.native.toLowerCase().includes(q))
      )
    );
  }, [query]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query || (COUNTRIES.find(c => c.code === value)?.name || "")}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search country..."
        className="w-full px-3 py-2 border rounded"
      />
      <div className="absolute z-30 mt-2 w-full max-h-56 overflow-auto bg-white border rounded shadow">
        {filtered.map((c) => (
          <div
            key={c.code}
            className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setQuery("");
              onChange(c.code);
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{c.name}</span>
              <span className="text-xs text-neutral-500 ml-auto">+{c.dial_code || ""}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;
