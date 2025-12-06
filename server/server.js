// server.js
// ==============================
// Load Environment Variables FIRST
// ==============================
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

// Path helpers (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (explicit path)
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("ENV Loaded:", {
  PORT: process.env.PORT,
  MODE: process.env.NODE_ENV,
  VITE_SERVER_URL: process.env.VITE_SERVER_URL ? "[present]" : "[missing]"
});

// ==============================
// App & Basic Middleware
// ==============================
const app = express();

// If behind a proxy/load balancer (Heroku, Nginx...), enable trust proxy
app.set("trust proxy", 1);

// ------------------------------
// CORS — limit to known origins
// ------------------------------
const allowedOrigins = [
  "https://www.thebrightrose.com",
  "https://thebrightrose.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
      return cb(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// ------------------------------
// Request logging
// ------------------------------
app.use(morgan("dev"));

// ------------------------------
// Body parsers
// Keep JSON limits high for image base64 uploads if necessary
// ------------------------------
app.use(express.json({ limit: "300mb" }));
app.use(bodyParser.json({ limit: "300mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "300mb" }));

// ==============================
// Ensure upload directories exist
// ==============================
const ensureDir = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log("Created directory:", dirPath);
    }
  } catch (err) {
    console.error("Failed to create directory", dirPath, err);
  }
};

const uploadsRoot = path.join(__dirname, "uploads");
const productsUploadDir = path.join(uploadsRoot, "products");
const invoicesUploadDir = path.join(uploadsRoot, "invoices");

// create if missing
ensureDir(productsUploadDir);
ensureDir(invoicesUploadDir);

// ------------------------------
// Make uploads publicly available
// ------------------------------
// Serve individual subpaths to avoid exposing whole server filesystem.
app.use("/uploads/products", express.static(productsUploadDir));
app.use("/uploads/invoices", express.static(invoicesUploadDir));

// Optionally expose all uploads (if you want other subfolders accessible):
// app.use("/uploads", express.static(uploadsRoot));

// ==============================
// Local Imports (routes / controllers / db)
// ==============================
import connectDB from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import contactRoute from "./routes/contactRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import wishlistRoutes from "./routes/wishlistRoute.js";
import addressRoutes from "./routes/addressRoute.js";
import sitemapRoute from "./sitemap.js";
import orderRoute from "./routes/orderRoute.js";
import { paymentWebhook } from "./controllers/payment/paymentWebhook.js";
import shippingRoute from "./routes/shippingRoute.js";
import geoipRoute from "./routes/geoipRoute.js";
import shippingRateRoute from "./routes/shippingRateRoute.js";

// ==============================
// Connect Database
// ==============================
connectDB();

// ==============================
// Base route & health
// ==============================
app.get("/", (req, res) => {
  res.send("✅ Server running successfully!");
});

// ==============================
// API Routes
// Keep route mounting consistent with your frontend expectations
// ==============================
app.use("/", sitemapRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/user/addresses", addressRoutes);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/shipping", shippingRoute);
app.use("/api/v1/geoip", geoipRoute);
app.use("/api/v1/admin/shipping-rates", shippingRateRoute);

// ------------------------------
// Webhook route that needs raw body
// Important: express.raw used specifically for this route
// ------------------------------
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);


// ==============================
// Serve frontend (if built) — final catch-all
// ==============================
const frontendPath = path.join(__dirname, "client", "dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ==============================
// Generic error handler (simple)
// ==============================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).send({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT} (mode: ${process.env.NODE_ENV || "dev"})`);
});
