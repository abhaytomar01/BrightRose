// server/utils/invoiceGenerator.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const outDir = path.join(process.cwd(), "uploads", "invoices");
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      const filename = `invoice_${order._id}.pdf`;
      const filepath = path.join(outDir, filename);

      const doc = new PDFDocument({ size: "A4", margin: 48 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text("Bright Rose", { align: "left" });
      doc.moveDown(0.2);
      doc.fontSize(10).text("Artisan Made in India", { align: "left" });
      doc.moveDown(1);

      // Invoice metadata
      doc.fontSize(12).text(`Invoice: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.moveDown();

      // Buyer
      doc.fontSize(11).text("Bill To:");
      doc.fontSize(10).text(order.buyer?.name || "");
      doc.text(order.buyer?.email || "");
      doc.moveDown();

      // Shipping address
      doc.fontSize(11).text("Shipping Address:");
      doc.fontSize(10).text(order.shippingInfo?.address || "");
      doc.text(`${order.shippingInfo?.city || ""}, ${order.shippingInfo?.state || ""} - ${order.shippingInfo?.pincode || ""}`);
      doc.text(order.shippingInfo?.country || "");
      doc.moveDown();

      // Table header
      doc.fontSize(11).text("Items:", { underline: true });
      doc.moveDown(0.4);

      // Table content (simple)
      order.products.forEach((p, i) => {
        const line = `${i + 1}. ${p.name} (${p.size || "—"}) — ${p.quantity} × ₹${p.price}`;
        doc.fontSize(10).text(line);
      });

      doc.moveDown(1);

      // Price summary
      doc.fontSize(11).text(`Subtotal: ₹${(order.subtotal || 0).toLocaleString()}`);
      doc.text(`Shipping: ₹${(order.shippingCharge || 0).toLocaleString()}`);
      doc.text(`Tax (GST included): ₹${(order.tax || 0).toLocaleString()}`);
      doc.moveDown(0.4);
      doc.fontSize(13).text(`Total: ₹${(order.totalAmount || 0).toLocaleString()}`, { bold: true });

      doc.moveDown(2);
      doc.fontSize(9).text("Notes: This is your commercial invoice. Please keep it for customs (for international shipments).", { align: "left" });

      doc.end();

      stream.on("finish", () => resolve({ filepath, filename }));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
