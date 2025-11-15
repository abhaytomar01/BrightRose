// =====================
// Load Environment Variables FIRST
// =====================
import dotenv from "dotenv";
dotenv.config();

// =====================
// Packages
// =====================
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
import uploadRoute from "./routes/uploadRoute.js";   // ⭐ ADD THIS

// =====================
// Setup dirname
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =====================
// Express app
// =====================
const app = express();

// =====================
// Cloudinary Config
// =====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================
// Middlewares
// =====================
app.use(
  cors({
    origin: [
      "https://thebrightrose.com",
      "https://www.thebrightrose.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =====================
// Connect DB
// =====================
connectDB();

// =====================
// Basic Route
// =====================
app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});

// =====================
// API Routes
// =====================
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/payment", paymentRoute);

app.use("/api/upload", uploadRoute);  // ⭐ IMPORTANT (Cloudinary upload route)

// =====================
// Subscription Test
// =====================
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  console.log("New subscriber:", email);
  return res.json({ message: "Subscription successful" });
});

// =====================
// Port Setup
// =====================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
});
