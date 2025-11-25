// ==============================
// Load Environment Variables FIRST
// ==============================
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// ==============================
// Cloudinary Config
// ==============================
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

// ==============================
// Packages
// ==============================
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

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
// Express App
// ==============================
const app = express();

// ==============================
// CORS FIX (Full working)
// ==============================

// app.use(cors());
app.use(
  cors({
    origin: [
      "https://www.thebrightrose.com",
      "http://localhost:5173",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// ==============================
// Body Parser
// ==============================
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// ==============================
// Logger
// ==============================
app.use(morgan("dev"));

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
