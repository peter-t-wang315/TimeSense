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

  // // 3 ------------------------------------------------------ 2.05
  // let startTime = new Date("2024-02-13T10:00:00Z").getTime() // 2/15/2024 at 3pm
  // let endTime = new Date("2024-02-13T12:05:00Z").getTime() // 2/15/2024 at 5pm

  // // Insert fake data with 5-second intervals
  // for (let timestamp = startTime; timestamp < endTime; timestamp += 5000) {
  //   db.run(
  //     "INSERT INTO userData (application, timestamp) VALUES (?, ?)",
  //     "Facebook",
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

  // // 2 ------------------------------------------------------ 2.24
  // startTime = new Date("2024-02-13T12:06:00Z").getTime() // 2/15/2024 at 3pm
  // endTime = new Date("2024-02-13T14:30:00Z").getTime() // 2/15/2024 at 5pm

  // // Insert fake data with 5-second intervals
  // for (let timestamp = startTime; timestamp < endTime; timestamp += 5000) {
  //   db.run(
  //     "INSERT INTO userData (application, timestamp) VALUES (?, ?)",
  //     "Yahoo",
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

  // // 5 ------------------------------------------------------ .29
  // startTime = new Date("2024-02-13T14:31:00Z").getTime() // 2/15/2024 at 3pm
  // endTime = new Date("2024-02-13T15:00:00Z").getTime() // 2/15/2024 at 5pm

  // // Insert fake data with 5-second intervals
  // for (let timestamp = startTime; timestamp < endTime; timestamp += 5000) {
  //   db.run(
  //     "INSERT INTO userData (application, timestamp) VALUES (?, ?)",
  //     "Instagram",
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

  // // 4 ------------------------------------------------------ .45
  // startTime = new Date("2024-02-13T18:45:00Z").getTime() // 2/15/2024 at 3pm
  // endTime = new Date("2024-02-13T19:30:00Z").getTime() // 2/15/2024 at 5pm

  // // Insert fake data with 5-second intervals
  // for (let timestamp = startTime; timestamp < endTime; timestamp += 5000) {
  //   db.run(
  //     "INSERT INTO userData (application, timestamp) VALUES (?, ?)",
  //     "Adobe",
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

  // 1 ------------------------------------------------------ 3.14
  // startTime = new Date("2024-02-16T19:31:00Z").getTime() // 2/15/2024 at 3pm
  // endTime = new Date("2024-02-16T22:45:00Z").getTime() // 2/15/2024 at 5pm

  // db.run(`DELETE FROM userData WHERE application = 'BROKEN'`, function (err) {
  //   if (err) {
  //     return console.error("Error deleting data:", err.message)
  //   }
  //   console.log(
  //     "All rows with application name 'BROKEN' deleted from the userData table"
  //   )
  // })

  // // Insert fake data with 5-second intervals
  // for (let timestamp = startTime; timestamp < endTime; timestamp += 5000) {
  //   db.run(
  //     "INSERT INTO userData (application, timestamp) VALUES (?, ?)",
  //     "LinkedIn",
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
