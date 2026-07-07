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

// Cadastrar produto
router.post("/", async (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body;

  if (!nome || !categoria) {
    return res.status(400).json({
      erro: "Nome e categoria são obrigatórios."
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO produtos (nome, categoria, quantidade, estoque_minimo) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, categoria, quantidade, estoque_minimo]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Editar produto
router.put("/:id", async (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body;

  try {
    await db.query(
      "UPDATE produtos SET nome=$1, categoria=$2, quantidade=$3, estoque_minimo=$4 WHERE id=$5",
      [nome, categoria, quantidade, estoque_minimo, req.params.id]
    );

    res.json({ mensagem: "Produto atualizado." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Excluir produto
router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM produtos WHERE id=$1",
      [req.params.id]
    );

    res.json({ mensagem: "Produto excluído." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;