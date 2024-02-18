"use server"
import sqlite3 from "sqlite3"
import { open, Database } from "sqlite"

// Let's initialize it as null initially, and we will assign the actual database instance later.
let db = null

export async function createData(values) {
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: "./userData.db", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    })
  }

  const top40 = [
    // Currently only 22
    "Discord",
    "Visual Studio Code",
    "YouTube",
    "Facebook",
    "Baidu",
    "Wikipedia",
    "Yahoo",
    "Twitter",
    "Amazon",
    "Instagram",
    "LinkedIn",
    "Reddit",
    "Netflix",
    "eBay",
    "Microsoft",
    "Tencent QQ",
    "Twitch",
    "WhatsApp",
    "Pinterest",
    "Adobe",
    "Google Chrome",
    "X",
  ]

  let matchedItem = top40.find((substring) => values[0].includes(substring))

  if (!matchedItem) {
    matchedItem = values[1]
  }

  const date = new Date()
  const localTimestamp = date.getTime() - date.getTimezoneOffset() * 60 * 1000

  const test = { $application: matchedItem, $timestamp: localTimestamp }

  db.run(
    "INSERT INTO userData (application, timestamp) VALUES ($application, $timestamp)",
    test,
    (err) => {
      if (err) {
        console.error("Error inserting value:", err.message)
      } else {
        console.log("Value inserted successfully:", values)
      }
    }
  )
}
