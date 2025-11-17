import nodemailer from "nodemailer";
import Contact from "../../models/contactModel.js";
import axios from "axios";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message, token } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // =============== Verify reCAPTCHA ================
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    if (!recaptchaVerify.data.success) {
      return res.status(400).json({ success: false, message: "reCAPTCHA failed" });
    }

    // =============== Save to DB ======================
    await Contact.create({
      name,
      email,
      message,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // =============== SMTP Transport ==================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });

    // =============== Admin Email =====================
    await transporter.sendMail({
      from: `"Bright Rose Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: "New Contact Form Message",
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    // =============== User Auto Response email ========
    await transporter.sendMail({
      from: `"Bright Rose Support" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: "We received your message",
      html: `
        <h3>Thank you for contacting Bright Rose! 🌹</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and our team will get back to you soon.</p>
        <p><strong>Your Message:</strong> ${message}</p>
        <br/>
        <p>Best Regards,<br/>Bright Rose Team</p>
      `,
    });

    // =============== Telegram Alert ==================
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramMsg = `📩 New Contact Form Submission\n\n👤 ${name}\n📧 ${email}\n💬 ${message}`;
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        { chat_id: process.env.TELEGRAM_CHAT_ID, text: telegramMsg }
      );
    }

    return res.json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error("Contact Form Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};



// import nodemailer from "nodemailer";

// export const sendContactMessage = async (req, res) => {
//   try {
//     const { name, email, message } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).send({ success: false, message: "All fields are required" });
//     }

//     // Gmail SMTP Transport
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.CONTACT_EMAIL,        // e.g., your Gmail
//         pass: process.env.CONTACT_EMAIL_PASS,  // App Password
//       },
//     });

//     // Email Content
//     const mailOptions = {
//       from: `"Bright Rose Contact" <${process.env.CONTACT_EMAIL}>`,
//       to: process.env.CONTACT_EMAIL, // Your Gmail inbox
//       subject: "New Contact Form Message - Bright Rose",
//       html: `
//         <h2>New Contact Form Submission</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(200).send({
//       success: true,
//       message: "Message sent successfully",
//     });
//   } catch (error) {
//     console.error("Contact Form Error:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Failed to send message",
//     });
//   }
// };
