const express = require("express");
const db = require("../database");

const router = express.Router();

// Listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM produtos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar produto por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM produtos WHERE id=$1",
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;