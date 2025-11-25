require("dotenv").config({ path: "./.env" });

module.exports = {
  apps: [
    {
      name: "brightrose-backend",
      script: "./server.js",
      watch: false,
      env: {
        NODE_ENV: "production",

        MONGODB_URL: process.env.MONGODB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        PORT: process.env.PORT,
        CLOUD_NAME: process.env.CLOUD_NAME,
        CLOUD_API_KEY: process.env.CLOUD_API_KEY,
        CLOUD_SECRET: process.env.CLOUD_SECRET,
        CLIENT_URL: process.env.CLIENT_URL,

        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_SECURE: process.env.SMTP_SECURE,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,

        CONTACT_EMAIL: process.env.CONTACT_EMAIL,
        CONTACT_EMAIL_PASS: process.env.CONTACT_EMAIL_PASS,

        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY
      }
    }
  ]
};
