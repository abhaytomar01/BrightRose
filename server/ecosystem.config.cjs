require("dotenv").config({ path: "./.env" });

module.exports = {
  apps: [
    {
      name: "brightrose-backend",
      script: "./server.js",

      // PM2 should NOT watch production server files
      watch: false,

      env: {
        NODE_ENV: "production",

        // ========== CORE ENV ==========
        MONGODB_URL: process.env.MONGODB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        PORT: process.env.PORT || 8080,
        CLIENT_URL: process.env.CLIENT_URL,

        // ========== CLOUDINARY ==========
        CLOUD_NAME: process.env.CLOUD_NAME,
        CLOUD_API_KEY: process.env.CLOUD_API_KEY,
        CLOUD_SECRET: process.env.CLOUD_SECRET,

        // ========== EMAIL ==========
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_SECURE: process.env.SMTP_SECURE,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,

        CONTACT_EMAIL: process.env.CONTACT_EMAIL,
        CONTACT_EMAIL_PASS: process.env.CONTACT_EMAIL_PASS,

        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,

        // ========== DISABLE RAZORPAY ==========
        // Do NOT pass undefined values to PM2 — causes Razorpay crash
        // RAZORPAY_KEY_ID: "",
        // RAZORPAY_KEY_SECRET: ""
      },
    },
  ],
};
