import express from "express";
import Product from "./models/productModel.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find().select("name images updatedAt _id");

    // Static Bright Rose pages (your structure)
    const staticPages = [
      { url: "/", freq: "daily", priority: "1.0" },
      { url: "/products", freq: "daily", priority: "0.9" },
      { url: "/weavecollection", freq: "weekly", priority: "0.8" },
      { url: "/stylecollection", freq: "weekly", priority: "0.8" },
      { url: "/ourheritage", freq: "monthly", priority: "0.7" },
      { url: "/contact", freq: "monthly", priority: "0.6" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
`;

    // STATIC PAGES
    staticPages.forEach((p) => {
      xml += `
  <url>
    <loc>https://thebrightrose.com${p.url}</loc>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
    });

    // DYNAMIC PRODUCT PAGES
    products.forEach((product) => {
      xml += `
  <url>
    <loc>https://thebrightrose.com/product/${product._id}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;

      // ADD ALL PRODUCT IMAGES
      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          const fullImageURL = `https://www.thebrightrose.com${img.url}`;
          xml += `
    <image:image>
      <image:loc>${fullImageURL}</image:loc>
      <image:title><![CDATA[${product.name} – Bright Rose]]></image:title>
    </image:image>
`;
        });
      }

      xml += `  </url>\n`;
    });

    xml += "</urlset>";

    res.header("Content-Type", "application/xml");
    res.send(xml);

  } catch (err) {
    console.error("Sitemap generation error:", err);
    return res.status(500).send("Error generating sitemap");
  }
});

export default router;
