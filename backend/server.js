const express = require("express")
const cors    = require("cors")
const db      = require("./database")

const app  = express()
const PORT = 3000

// permite o front-end conversar com o servidor
app.use(cors())

// permite receber JSON nas requisições
app.use(express.json())

// ================================
// ROTAS DE PRODUTOS
// ================================

// buscar todos os produtos
app.get("/produtos", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message })
    res.json(rows)
  })
})

// buscar produto por id
app.get("/produtos/:id", (req, res) => {
  db.get("SELECT * FROM produtos WHERE id=?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message })
    res.json(row)
  })
})

// cadastrar novo produto
app.post("/produtos", (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body

  if (!nome || !categoria) {
    return res.status(400).json({ erro: "Nome e categoria são obrigatórios." })
  }

  db.run(
    "INSERT INTO produtos (nome, categoria, quantidade, estoque_minimo) VALUES (?, ?, ?, ?)",
    [nome, categoria, quantidade, estoque_minimo],
    function(err) {
      if (err) return res.status(500).json({ erro: err.message })
      res.json({ id: this.lastID, nome, categoria, quantidade, estoque_minimo })
    }
  )
})

// editar produto
app.put("/produtos/:id", (req, res) => {
  const { nome, categoria, quantidade, estoque_minimo } = req.body
  const { id } = req.params

  db.run(
    "UPDATE produtos SET nome=?, categoria=?, quantidade=?, estoque_minimo=? WHERE id=?",
    [nome, categoria, quantidade, estoque_minimo, id],
    function(err) {
      if (err) return res.status(500).json({ erro: err.message })
      res.json({ mensagem: "Produto atualizado com sucesso." })
    }
  )
})

// excluir produto
app.delete("/produtos/:id", (req, res) => {
  db.run("DELETE FROM produtos WHERE id=?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message })
    res.json({ mensagem: "Produto excluído com sucesso." })
  })
})

// ================================
// ROTAS DE MOVIMENTAÇÕES
// ================================

// buscar todas as movimentações
app.get("/movimentacoes", (req, res) => {
  db.all("SELECT * FROM movimentacoes ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message })
    res.json(rows)
  })
})

// registrar movimentação
app.post("/movimentacoes", (req, res) => {
  const { produto_id, produto, tipo, quantidade, observacao, data } = req.body

  // atualiza quantidade do produto
  const sql = tipo === "entrada"
    ? "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?"
    : "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?"

  db.run(sql, [quantidade, produto_id], function(err) {
    if (err) return res.status(500).json({ erro: err.message })

    // salva a movimentação
    db.run(
      "INSERT INTO movimentacoes (produto_id, produto, tipo, quantidade, observacao, data) VALUES (?, ?, ?, ?, ?, ?)",
      [produto_id, produto, tipo, quantidade, observacao, data],
      function(err) {
        if (err) return res.status(500).json({ erro: err.message })
        res.json({ mensagem: "Movimentação registrada com sucesso." })
      }
    )
  })
})

// ================================
// INICIA O SERVIDOR
// ================================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})