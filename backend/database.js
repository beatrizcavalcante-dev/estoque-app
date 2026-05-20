const sqlite3 = require("sqlite3").verbose()
const path    = require("path")

// cria ou abre o arquivo do banco de dados
const db = new sqlite3.Database(path.join(__dirname, "estoque.db"))

// cria as tabelas se não existirem
db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nome        TEXT    NOT NULL,
      categoria   TEXT    NOT NULL,
      quantidade  INTEGER DEFAULT 0,
      estoque_minimo INTEGER DEFAULT 0
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      produto    TEXT    NOT NULL,
      tipo       TEXT    NOT NULL,
      quantidade INTEGER NOT NULL,
      observacao TEXT,
      data       TEXT    NOT NULL,
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    )
  `)

})

module.exports = db