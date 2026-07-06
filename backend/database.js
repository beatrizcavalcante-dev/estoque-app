const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./estoque.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Banco SQLite conectado.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      quantidade INTEGER DEFAULT 0,
      estoque_minimo INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      produto TEXT NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      observacao TEXT,
      data TEXT NOT NULL
    )
  `);

  console.log("Banco pronto!");
});

db.query = (sql, params = []) => {
  return new Promise((resolve, reject) => {

    const comando = sql.trim().toUpperCase();

    if (comando.startsWith("SELECT")) {

      db.all(sql.replace(/\$\d+/g, "?"), params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });

    } else if (comando.startsWith("INSERT")) {

      db.run(sql.replace(/\$\d+/g, "?").replace(" RETURNING *", ""), params, function(err) {

        if (err) reject(err);

        else {

          db.get("SELECT * FROM " +
            (sql.includes("produtos") ? "produtos" : "movimentacoes") +
            " WHERE id = ?", [this.lastID], (err, row) => {

            if (err) reject(err);
            else resolve({ rows: [row] });

          });

        }

      });

    } else {

      db.run(sql.replace(/\$\d+/g, "?"), params, function(err) {

        if (err) reject(err);
        else resolve({ rows: [] });

      });

    }

  });
};

module.exports = db;