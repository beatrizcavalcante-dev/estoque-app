const express = require("express")
const cors = require("cors")
const db = require("./database")

const produtosRoutes = require("./routes/produtosRoutes");

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use("/produtos", produtosRoutes);

app.post("/produtos", async (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body
  if (!nome || !categoria) return res.status(400).json({ erro: "Nome e categoria são obrigatórios." })

  try {
    const result = await db.query(
      "INSERT INTO produtos (nome, categoria, quantidade, estoque_minimo) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, categoria, quantidade, estoque_minimo]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.put("/produtos/:id", async (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body
  try {
    await db.query(
      "UPDATE produtos SET nome=$1, categoria=$2, quantidade=$3, estoque_minimo=$4 WHERE id=$5",
      [nome, categoria, quantidade, estoque_minimo, req.params.id]
    )
    res.json({ mensagem: "Produto atualizado." })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.delete("/produtos/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM produtos WHERE id=$1", [req.params.id])
    res.json({ mensagem: "Produto excluído." })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.get("/movimentacoes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM movimentacoes ORDER BY id DESC")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.post("/movimentacoes", async (req, res) => {
  const { produto_id, produto, tipo, quantidade, observacao, data } = req.body

  try {
    const sql = tipo === "entrada"
      ? "UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2"
      : "UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2"

    await db.query(sql, [quantidade, produto_id])

    const result = await db.query(
      "INSERT INTO movimentacoes (produto_id, produto, tipo, quantidade, observacao, data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [produto_id, produto, tipo, quantidade, observacao, data]
    )

    res.json({ mensagem: "Movimentação registrada.", id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})