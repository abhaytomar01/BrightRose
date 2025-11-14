import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    // Gmail SMTP Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,        // e.g., your Gmail
        pass: process.env.CONTACT_EMAIL_PASS,  // App Password
      },
    });

    // Email Content
    const mailOptions = {
      from: `"Bright Rose Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL, // Your Gmail inbox
      subject: "New Contact Form Message - Bright Rose",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to send message",
    });
  }
};
