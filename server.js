import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import complet from "./completbac/mekody.js";
import completer from "./completbac/contact.js";

dotenv.config();

const app = express();

// ✅ Middleware CORS (manuel et automatique)
const allowedOrigins = [
  "http://localhost:5173",
  "https://dashboard-mekody.netlify.app",
  "https://www.mekody.com",
  "https://bacmekody.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Express JSON parser
app.use(express.json());

// ✅ Routes
app.use("/api/mekody", complet);
app.use("/api/contact", completer);

// 🏥 Test route
app.get("/api/health", async (req, res) => {
  try {
    const dbCheck = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "healthy",
      dbTime: dbCheck.rows[0],
    });
  } catch (err) {
    res.status(500).json({ status: "unhealthy", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend Mekody opérationnel (CORS activé)");
});

// ⚠️ Pas de app.listen() sur Vercel
export default app;
