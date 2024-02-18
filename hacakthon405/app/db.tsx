import sqlite3 from "sqlite3"
import { open } from "sqlite"

export default (async () => {
  const db = await open({
    filename: "../userData.db", // Specify the database file
    driver: sqlite3.Database,
  })
})()
