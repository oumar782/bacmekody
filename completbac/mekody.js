import express from "express";
import pool from "../db.js";

const router = express.Router();

/* -------------------------
   CRUD UTILISATEURS (login)
-------------------------- */

// ➕ Créer un utilisateur
router.post("/utilisateurs", async (req, res) => {
  try {
    const { nom_utilisateur, courriel, mot_de_passe } = req.body;
    const result = await pool.query(
      "INSERT INTO mekodys (nom_utilisateur, courriel, mot_de_passe) VALUES ($1, $2, $3) RETURNING *",
      [nom_utilisateur, courriel, mot_de_passe]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Connexion
router.post("/login", async (req, res) => {
  try {
    const { courriel, mot_de_passe } = req.body;
    const result = await pool.query(
      "SELECT * FROM mekodys WHERE courriel = $1 AND mot_de_passe = $2",
      [courriel, mot_de_passe]
    );
    if (result.rows.length > 0) {
      res.json({ message: "Connexion réussie ✅", utilisateur: result.rows[0] });
    } else {
      res.status(401).json({ message: "Email ou mot de passe incorrect ❌" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Lire tous les utilisateurs
router.get("/utilisateurs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mekodys");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Lire un utilisateur par ID
router.get("/utilisateurs/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mekodys WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Modifier un utilisateur
router.put("/utilisateurs/:id", async (req, res) => {
  try {
    const { nom_utilisateur, courriel, mot_de_passe } = req.body;
    const result = await pool.query(
      "UPDATE mekodys SET nom_utilisateur = $1, courriel = $2, mot_de_passe = $3 WHERE id = $4 RETURNING *",
      [nom_utilisateur, courriel, mot_de_passe, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Supprimer un utilisateur
router.delete("/utilisateurs/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM mekodys WHERE id = $1", [req.params.id]);
    res.json({ message: "Utilisateur supprimé ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
