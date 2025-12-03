import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceId = "BR-INV-" + Date.now();
      const invoicePath = path.join("invoices", `${invoiceId}.pdf`);

      if (!fs.existsSync("invoices")) {
        fs.mkdirSync("invoices");
      }

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(invoicePath);
      doc.pipe(stream);

      // HEADER
      doc
        .fontSize(22)
        .fillColor("#AD000F")
        .text("BRIGHT ROSE", { align: "center" });

      doc
        .moveDown()
        .fontSize(12)
        .fillColor("#333")
        .text(`Invoice ID: ${invoiceId}`)
        .text(`Order ID: ${order._id}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

      doc.moveDown();

      // CUSTOMER DETAILS
      doc.fontSize(14).fillColor("#000").text("Billing Details:");
      doc.fontSize(12).fillColor("#444");
      doc.text(order.address.name)
        .text(order.address.address)
        .text(`${order.address.city}, ${order.address.state}`)
        .text(`Pincode: ${order.address.pincode}`)
        .moveDown();

      // ORDER ITEMS TABLE
      doc.moveDown().fontSize(14).fillColor("#000").text("Order Summary:");
      doc.moveDown();

      order.items.forEach((item, i) => {
        doc
          .fontSize(12)
          .fillColor("#444")
          .text(
            `${i + 1}. ${item.name} (Size: ${item.size})`,
            { continued: true }
          )
          .text(` — ₹${item.price} x ${item.quantity}`, { align: "right" });

        doc.moveDown(0.3);
      });

      doc.moveDown();
      doc.fontSize(14).fillColor("#000");
      doc.text(`Total Amount: ₹${order.totalAmount}`, { align: "right" });

      // FOOTER
      doc.moveDown(2);
      doc
        .fontSize(10)
        .fillColor("#999")
        .text(
          "Thank you for shopping with Bright Rose. Each piece is handcrafted with love.",
          { align: "center" }
        );

      doc.end();

      stream.on("finish", () => resolve({ invoiceId, invoicePath }));
      stream.on("error", reject);

    } catch (error) {
      reject(error);
    }
  });
};
