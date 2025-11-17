import express from "express";

const router = express.Router();

// Simple test endpoint to make sure route works
router.get("/test", (req, res) => {
  res.send("Upload route working");
});

export default router;
