// ==============================
// Load Environment Variables FIRST
// ==============================
import dotenv from "dotenv";

import { fileURLToPath } from "url";

// Path helpers
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually (same folder as server.js)
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("ENV Loaded:", {
  PORT: process.env.PORT,
  MODE: process.env.NODE_ENV,
});

// ==============================
// Packages
// ==============================
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

// Serve static files
import fs from "fs";
const app = express();

// ==============================
// CORS FIX
// ==============================
app.use(
  cors({
    origin: [
      "https://www.thebrightrose.com",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==============================
// Body Parser
// ==============================
app.use(express.json({ limit: "300mb" }));
app.use(bodyParser.json({ limit: "300mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "300mb" }));

// ==============================
// Logger
// ==============================
app.use(morgan("dev"));

// ==============================
// Make /uploads folder public
// (IMPORTANT FOR LOCAL IMAGE STORAGE)
// ==============================

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==============================
// Local Imports
// ==============================
import connectDB from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import contactRoute from "./routes/contactRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

// ==============================
// Connect Database
// ==============================
connectDB();

// ==============================
// Base Route
// ==============================
app.get("/", (req, res) => {
  res.send("✅ Server running successfully!");
});

// ==============================
// API Routes
// ==============================
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/payment", paymentRoute);

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
