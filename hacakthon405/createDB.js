const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./userData.db")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS userData (
      id INTEGER PRIMARY KEY,
      application TEXT,
      timestamp INTEGER
    )
  `)

  console.log("Database schema created")
})

db.close()
