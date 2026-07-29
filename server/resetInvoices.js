import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/orderModel.js";

dotenv.config();

const resetInvoices = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected.");

    console.log("Resetting all invoices...");
    const result = await Order.updateMany(
      {},
      { $unset: { invoicePath: 1 } }
    );

    console.log(`✅ Successfully reset invoices for ${result.modifiedCount} orders.`);
    console.log("You can now regenerate them from the Admin Panel.");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error resetting invoices:", err);
    process.exit(1);
  }
};

resetInvoices();
