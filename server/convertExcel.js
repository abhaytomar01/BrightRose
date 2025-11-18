import xlsx from "xlsx";
import fs from "fs";

const excelFile = "./data/SKU Description.xlsx"; // update path if needed

// Utility to clean text fields
const clean = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/#/g, "")               // remove #
    .replace(/\r\n/g, "\n")          // normalize line breaks
    .replace(/\n{2,}/g, "\n")        // remove extra blank lines
    .trim();
};

const workbook = xlsx.readFile(excelFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

const products = rows.map(row => ({
  name: clean(row["Name"]),
  fabric: clean(row["Fabric"]),
  color: clean(row["Color"]),
  weavingArt: clean(row["Weaving Art"]),
  uniqueness: clean(row["One of a Kind"]),
  sizeInfo: clean(row["Size"]),
  description: clean(row["Product Description"]),
  specification: clean(row["Specification"]),
  care: clean(row["Care"]),
  images: [],
  sku: "",
  price: 0,
  stock: 0,
  tags: []
}));

fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

console.log("✨ Excel converted successfully → products.json cleaned and created!");
