// server/routes/geoipRoute.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/detect", async (req, res) => {
  try {
    // best-effort: extract ip
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    // use ipapi.co (no key, limited) as example:
    const provider = process.env.GEOIP_PROVIDER || "ipapi";

    let country = "India";

    if (provider === "ipapi") {
      const url = `https://ipapi.co/${ip}/json/`;
      const r = await axios.get(url);
      country = r.data.country_name || r.data.country || country;
    } else if (provider === "ipinfo") {
      const token = process.env.GEOIP_API_KEY || "";
      const url = `https://ipinfo.io/${ip}/json${token ? `?token=${token}` : ""}`;
      const r = await axios.get(url);
      country = r.data.country || r.data.country_name || country;
    }

    return res.json({ success: true, country });
  } catch (err) {
    console.error("GeoIP error:", err?.response?.data || err);
    return res.json({ success: false, country: "India" });
  }
});

export default router;
