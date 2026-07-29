// server/utils/invoiceGenerator.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount) {
  return "Rs. " + (amount || 0).toLocaleString("en-IN");
}

export const generateInvoicePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const outDir = path.join(process.cwd(), "uploads", "invoices");
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      const filename = `invoice_${order._id}.pdf`;
      const filepath = path.join(outDir, filename);

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // --- 1. HEADER ---
      doc.fillColor("#444444")
         .fontSize(24)
         .text("BRIGHT ROSE", 50, 57)
         .fontSize(10)
         .text("Artisan Made in India", 50, 85)
         .text("www.thebrightrose.com", 50, 100)
         .fontSize(20)
         .text("INVOICE", 400, 57, { align: "right" })
         .fontSize(10)
         .text(`Invoice #: ${order.publicOrderId || order._id}`, 200, 85, { align: "right" })
         .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 200, 100, { align: "right" })
         .text(`Payment: ${order.paymentInfo?.status?.toUpperCase() || "PENDING"}`, 200, 115, { align: "right" });

      generateHr(doc, 140);

      // --- 2. ADDRESSES ---
      doc.fontSize(12).fillColor("#333333").text("Bill To:", 50, 160);
      doc.fontSize(10).fillColor("#555555")
         .text(order.buyer?.name || "Customer", 50, 175)
         .text(order.buyer?.email || "", 50, 190)
         .text(order.buyer?.phone || "", 50, 205);

      doc.fontSize(12).fillColor("#333333").text("Ship To:", 300, 160);
      doc.fontSize(10).fillColor("#555555")
         .text(order.shippingInfo?.address || "", 300, 175)
         .text(`${order.shippingInfo?.city || ""}, ${order.shippingInfo?.state || ""} - ${order.shippingInfo?.pincode || ""}`, 300, 190)
         .text(order.shippingInfo?.country || "India", 300, 205);

      generateHr(doc, 235);

      // --- 3. ITEMS TABLE HEADER ---
      const invoiceTableTop = 260;
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333");
      doc.text("Item Description", 50, invoiceTableTop)
         .text("Size", 280, invoiceTableTop)
         .text("Unit Price", 350, invoiceTableTop, { width: 90, align: "right" })
         .text("Qty", 440, invoiceTableTop, { width: 40, align: "right" })
         .text("Total", 480, invoiceTableTop, { width: 70, align: "right" });

      generateHr(doc, invoiceTableTop + 20);

      // --- 4. ITEMS TABLE ROWS ---
      let position = invoiceTableTop + 30;
      doc.font("Helvetica").fillColor("#555555");
      
      order.products.forEach((p) => {
        const itemTotal = (p.price || 0) * (p.quantity || 1);
        
        // Handle long product names by calculating height
        const nameHeight = doc.heightOfString(p.name, { width: 220 });
        
        doc.text(p.name, 50, position, { width: 220 })
           .text(p.size || "—", 280, position)
           .text(formatCurrency(p.price), 350, position, { width: 90, align: "right" })
           .text(p.quantity, 440, position, { width: 40, align: "right" })
           .text(formatCurrency(itemTotal), 480, position, { width: 70, align: "right" });
           
        position += Math.max(25, nameHeight + 10);
      });

      generateHr(doc, position + 5);

      // --- 5. FINANCIAL SUMMARY ---
      const summaryTop = position + 20;
      doc.font("Helvetica").fillColor("#555555");
      
      doc.text("Subtotal:", 350, summaryTop, { width: 100, align: "right" })
         .text(formatCurrency(order.subtotal || order.totalAmount), 460, summaryTop, { width: 90, align: "right" });

      doc.text("Shipping:", 350, summaryTop + 20, { width: 100, align: "right" })
         .text(formatCurrency(order.shippingCharge || 0), 460, summaryTop + 20, { width: 90, align: "right" });

      doc.text("Tax (GST included):", 350, summaryTop + 40, { width: 100, align: "right" })
         .text(formatCurrency(order.tax || 0), 460, summaryTop + 40, { width: 90, align: "right" });

      generateHr(doc, summaryTop + 65);

      doc.font("Helvetica-Bold").fillColor("#333333").fontSize(12);
      doc.text("Grand Total:", 350, summaryTop + 75, { width: 100, align: "right" })
         .text(formatCurrency(order.totalAmount), 460, summaryTop + 75, { width: 90, align: "right" });

      // --- 6. FOOTER ---
      doc.font("Helvetica").fontSize(9).fillColor("#888888");
      doc.text(
        "Thank you for your business! This is a system-generated commercial invoice and does not require a signature.",
        50,
        730,
        { align: "center", width: 500 }
      );

      doc.end();

      const relativePath = `uploads/invoices/${filename}`;
      stream.on("finish", () => resolve({ filepath, filename, relativePath }));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
