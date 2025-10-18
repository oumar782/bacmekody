import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import complet from "./completbac/mekody.js";
import completer from "./completbac/contact.js";

dotenv.config();
const app = express();

// ✅ CORS configuré
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.mekody.com",
      "https://dashboard-mekody.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware JSON
app.use(express.json());

// ✅ Routes principales
app.use("/api/mekody", complet);
app.use("/api/contact", completer);

// 📄 Route racine
app.get("/", (req, res) => {
  res.send("✅ Serveur backend Mekody en marche sur Vercel !");
});

// 🏥 Route de santé (check DB)
app.get("/api/health", async (req, res) => {
  try {
    const dbCheck = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "healthy",
      time: new Date().toISOString(),
      db: dbCheck.rows[0],
    });
  } catch (err) {
    res.status(500).json({ status: "unhealthy", error: err.message });
  }
});

// 🚨 Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
});

// ⚠️ NE PAS UTILISER app.listen() SUR VERCEL
// On exporte simplement l'app pour que Vercel la gère
export default app;
