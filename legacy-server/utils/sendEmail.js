import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Bright Rose" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments
    });

    return true;
  } catch (error) {
    console.log("Email Error:", error);
    return false;
  }
};
