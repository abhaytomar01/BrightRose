// =====================
// Load Environment Variables FIRST
// =====================
import dotenv from "dotenv";
dotenv.config();

// =====================
// Cloudinary Config
// =====================
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

// =====================
// Packages
// =====================
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

// =====================
// Local Imports
// =====================
import connectDB from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import contactRoute from "./routes/contactRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =====================
// Express app
// =====================
const app = express();

// =====================
// CORS
// =====================
app.use(
  cors({
    origin: [
      "https://thebrightrose.com",
      "https://www.thebrightrose.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =====================
// Body Parsers (allow base64 uploads)
// =====================
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(morgan("dev"));

// =====================
// Connect DB
// =====================
connectDB();

// =====================
// Routes
// =====================
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/payment", paymentRoute);

// =====================
// Port
// =====================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
