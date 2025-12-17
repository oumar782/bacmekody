import express from "express";
import pool from "../db.js";

const router = express.Router();

// ➕ Ajouter un contact
router.post("/contact_mekody", async (req, res) => {
  try {
    const { nom_complet, courriel, entreprise, service_interesse, message } = req.body;
    const result = await pool.query(
      `INSERT INTO contact_mekody (nom_complet, courriel, entreprise, service_interesse, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nom_complet, courriel, entreprise, service_interesse, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Lire tous les contacts
router.get("/contact_mekody", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contact_mekody ORDER BY date_creation DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Lire un contact par ID
router.get("/contact_mekody/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contact_mekody WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Contact non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Modifier un contact
router.put("/contact_mekody/:id", async (req, res) => {
  try {
    const { nom_complet, courriel, entreprise, service_interesse, message } = req.body;
    const result = await pool.query(
      `UPDATE contact_mekody 
       SET nom_complet=$1, courriel=$2, entreprise=$3, service_interesse=$4, message=$5
       WHERE id=$6 RETURNING *`,
      [nom_complet, courriel, entreprise, service_interesse, message, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Contact non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Supprimer un contact
router.delete("/contact_mekody/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM contact_mekody WHERE id = $1 RETURNING *", [
      req.params.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Contact non trouvé" });
    res.json({ message: "✅ Contact supprimé", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;