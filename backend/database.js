const Database = require("better-sqlite3")
const path = require("path")

const db = new Database(path.join(__dirname, "estoque.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nome           TEXT    NOT NULL,
    categoria      TEXT    NOT NULL,
    quantidade     INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 0
  )
`)

db.exec(`
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

module.exports = db