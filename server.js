import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js"; // Import de la connexion DB
import complet from './completbac/mekody.js';
import completer from './completbac/contact.js';


dotenv.config();

const app = express();

// ✅ CORS configuré
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://mekody.com",
      "https://dashboard-mekody.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware pour parser JSON
app.use(express.json());
app.use('/api/mekody', complet);
app.use('/api/contact', completer);
// 📄 Route racine
app.get("/", (req, res) => {
  res.send("✅ Serveur backend en marche");
});

// 🏥 Health check
app.get("/api/health", async (req, res) => {
  try {
    const dbCheck = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      database: dbCheck.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      error: err.message,
    });
  }
});

// 🚨 Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error("❌ Erreur:", err.stack || err);

  if (err.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Erreur de validation",
      errors: err.errors,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});