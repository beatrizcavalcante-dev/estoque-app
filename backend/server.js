const express = require("express")
const cors = require("cors")
const db = require("./database")

const produtosRoutes = require("./routes/produtosRoutes");

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use("/produtos", produtosRoutes);

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