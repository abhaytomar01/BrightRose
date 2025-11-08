//packages
import dotenv from "dotenv";
//configure env
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//local imports
import connectDB from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";  

//rest object
const app = express();


//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

//middleware
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend port (Vite default)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,  
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(morgan("dev"));
// to send large files
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
    })
);

// use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../client/dist")));
//connect DB
connectDB();

//port
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello there!");
});

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);

// app.use("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Example: Save to database or Mailchimp
  console.log("New subscriber:", email);

  return res.json({ message: "Subscription successful" });
});


app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
