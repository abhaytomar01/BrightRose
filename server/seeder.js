import mongoose from "mongoose";
import productModel from "./models/productModel.js";
import products from "./demoProducts.json" assert { type: "json" };

mongoose.connect("mongodb://localhost:27017/yourDB");

const fixProducts = async () => {
  await productModel.deleteMany(); // clear old data
  const inserted = await productModel.insertMany(
    products.map(p => {
      delete p._id;
      return p;
    })
  );
  console.log("✅ Products inserted:", inserted.length);
  mongoose.connection.close();
};

fixProducts();
