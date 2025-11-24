// =====================
// Load Environment Variables FIRST
// =====================
import dotenv from "dotenv";
dotenv.config();

// =====================
// Cloudinary Config  ✅
// =====================
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
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

import fileUpload from "express-fileupload";

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
// Middlewares
// =====================
app.use(
  cors({
    origin: [
      "https://thebrightrose.com",
      "https://www.thebrightrose.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());
app.use(morgan("dev"));
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
// File Upload (for Cloudinary + multer)
// =====================
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// =====================
// API Routes
// =====================
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/payment", paymentRoute);

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
