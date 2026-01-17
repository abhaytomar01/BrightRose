// controllers/contact/contactController.js
import nodemailer from "nodemailer";
import Contact from "../../models/contactModel.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // basic validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
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
        <h3>Thank you for contacting Bright Rose!</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and our team will get back to you soon.</p>
        <p><strong>Your Message:</strong> ${message}</p>
        <br/>
        <p>Best Regards,<br/>Bright Rose Team</p>
      `,
    });

    // =============== Telegram Alert (optional) ========
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramMsg = `📩 New Contact Form Submission\n\n👤 ${name}\n📧 ${email}\n💬 ${message}`;
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        { chat_id: process.env.TELEGRAM_CHAT_ID, text: telegramMsg }
      );
    }

    return res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to send message",
      });
  }
};
