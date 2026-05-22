const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// cria as tabelas se não existirem
async function inicializar() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS produtos (
      id             SERIAL PRIMARY KEY,
      nome           TEXT    NOT NULL,
      categoria      TEXT    NOT NULL,
      quantidade     INTEGER DEFAULT 0,
      estoque_minimo INTEGER DEFAULT 0
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id         SERIAL PRIMARY KEY,
      produto_id INTEGER NOT NULL,
      produto    TEXT    NOT NULL,
      tipo       TEXT    NOT NULL,
      quantidade INTEGER NOT NULL,
      observacao TEXT,
      data       TEXT    NOT NULL
    )
  `)

  console.log("Banco de dados pronto!")
}

inicializar()

module.exports = pool