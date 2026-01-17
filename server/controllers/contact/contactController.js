import nodemailer from "nodemailer";
import Contact from "../../models/contactModel.js";
import axios from "axios";

// contactController.js
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message, token } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // =============== Verify reCAPTCHA ================
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const recaptchaVerify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    if (!recaptchaVerify.data.success) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed",
      });
    }

    // =============== Save to DB ======================
    await Contact.create({
      name,
      email,
      message,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // nodemailer + telegram code unchanged...
    // ...

    return res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send message" });
  }
};

