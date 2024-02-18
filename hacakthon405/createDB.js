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

  // const startTime = new Date("2024-02-15T17:00:00Z").getTime() // 2/15/2024 at 3pm
  // const endTime = new Date("2024-02-15T17:05:00Z").getTime() // 2/15/2024 at 5pm

  // // Insert fake data with 5-second intervals
  // for (let timestamp = startTime; timestamp < endTime; timestamp += 5000) {
  //   db.run(
  //     "INSERT INTO userData (application, timestamp) VALUES (?, ?)",
  //     "Youtube",
  //     timestamp,
  //     (err) => {
  //       if (err) {
  //         console.error("Error inserting value:", err.message)
  //       } else {
  //         console.log("Value inserted successfully:", timestamp)
  //       }
  //     }
  //   )
  // }
})

db.close()
