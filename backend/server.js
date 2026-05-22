const express = require("express")
const cors    = require("cors")
const db      = require("./database")

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// ROTAS DE PRODUTOS // 

app.get("/produtos", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM produtos").all()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.get("/produtos/:id", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM produtos WHERE id=?").get(req.params.id)
    res.json(row)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.post("/produtos", (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body
  if (!nome || !categoria) return res.status(400).json({ erro: "Nome e categoria são obrigatórios." })

  try {
    const result = db.prepare(
      "INSERT INTO produtos (nome, categoria, quantidade, estoque_minimo) VALUES (?, ?, ?, ?)"
    ).run(nome, categoria, quantidade, estoque_minimo)
    res.json({ id: result.lastInsertRowid, nome, categoria, quantidade, estoque_minimo })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.put("/produtos/:id", (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body
  try {
    db.prepare(
      "UPDATE produtos SET nome=?, categoria=?, quantidade=?, estoque_minimo=? WHERE id=?"
    ).run(nome, categoria, quantidade, estoque_minimo, req.params.id)
    res.json({ mensagem: "Produto atualizado." })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.delete("/produtos/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM produtos WHERE id=?").run(req.params.id)
    res.json({ mensagem: "Produto excluído." })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// ROTAS DE MOVIMENTAÇÕES //

app.get("/movimentacoes", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM movimentacoes ORDER BY id DESC").all()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.post("/movimentacoes", (req, res) => {
  const { produto_id, produto, tipo, quantidade, observacao, data } = req.body

  try {
    const sql = tipo === "entrada"
      ? "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?"
      : "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?"

    db.prepare(sql).run(quantidade, produto_id)

    const result = db.prepare(
      "INSERT INTO movimentacoes (produto_id, produto, tipo, quantidade, observacao, data) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(produto_id, produto, tipo, quantidade, observacao, data)

    res.json({ mensagem: "Movimentação registrada.", id: result.lastInsertRowid })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})