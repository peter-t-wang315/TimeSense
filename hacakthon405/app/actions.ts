"use server"
import sqlite3 from "sqlite3"
import { open, Database } from "sqlite"
import { resolve } from "path"

// Let's initialize it as null initially, and we will assign the actual database instance later.
let db = null

const query = `
    SELECT 
        application, 
        COUNT(*) * 5 AS totalSeconds, 
        CASE 
            WHEN COUNT(*) >= 120960 THEN 
                (COUNT(*) / 120960) || ' week' || (CASE WHEN COUNT(*) / 120960 > 1 THEN 's' ELSE '' END) 
            WHEN COUNT(*) >= 17280 THEN 
                (COUNT(*) / 17280) || ' day' || (CASE WHEN COUNT(*) / 17280 > 1 THEN 's' ELSE '' END) 
            WHEN COUNT(*) >= 720 THEN 
                FLOOR(COUNT(*) / 720) || ' hour' || 
                (CASE WHEN FLOOR(COUNT(*) / 720) > 1 THEN 's' ELSE '' END) || ' ' || 
                FLOOR((COUNT(*) % 720) / 60) || ' minute' || 
                (CASE WHEN FLOOR((COUNT(*) % 720) / 60) > 1 THEN 's' ELSE '' END) 
            WHEN COUNT(*) >= 12 THEN 
                (COUNT(*) / 12) || ' minute' || (CASE WHEN COUNT(*) / 12 > 1 THEN 's' ELSE '' END) 
            WHEN COUNT(*) < 12 THEN 
                '<1 minute' 
            ELSE 
                COUNT(*) || ' second' || (CASE WHEN COUNT(*) > 1 THEN 's' ELSE '' END) 
        END AS timeString 
    FROM 
        userData 
    WHERE 
        timestamp > ? 
    GROUP BY 
        application`

const query2 = `
SELECT application, 
    COUNT(*) * 5 AS totalSeconds, 
    CASE 
        WHEN COUNT(*) * 5 >= 60*60*24*7 THEN (COUNT(*) * 5 / (60*60*24*7)) || 'w' 
        WHEN COUNT(*) * 5 >= 60*60*24 THEN (COUNT(*) * 5 / (60*60*24)) || 'd' 
        WHEN COUNT(*) * 5 >= 60*60 THEN 
            FLOOR((COUNT(*) * 5) / (60*60)) || 'h ' || 
            FLOOR(((COUNT(*) * 5) % (60*60)) / 60) || 'm' 
        WHEN COUNT(*) * 5 >= 60 THEN (COUNT(*) * 5 / 60) || 'm' 
        WHEN COUNT(*) * 5 < 60 THEN '<1m' 
        ELSE COUNT(*) * 5 || 's' 
    END AS timeString 
    FROM userData 
    WHERE timestamp > ? 
    AND timestamp < ? 
    GROUP BY application
    ORDER BY 
        totalSeconds DESC
    LIMIT 
        5`

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
  const localTimestamp = date.getTime()

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

export async function getData(startTimestamp, queryString) {
  db = new sqlite3.Database("./userData.db")

  return new Promise(function (resolve, reject) {
    db.all(queryString, startTimestamp, (err, rows) => {
      if (err) {
        console.log("ERROR")
        console.error("Error querying database:", err.message)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function getDataEndTime(startTimestamp, endTimestamp, queryString) {
  db = new sqlite3.Database("./userData.db")

  return new Promise(function (resolve, reject) {
    db.all(queryString, [startTimestamp, endTimestamp], (err, rows) => {
      if (err) {
        console.log("ERROR")
        console.error("Error querying database:", err.message)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export async function getDailyData() {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const startOfDayTimestamp = startOfDay.getTime()

  return getData(startOfDayTimestamp, query)
}

export async function getWeeklyData() {
  const startOfDay = new Date()
  const startOfDayTimestamp = startOfDay.getTime() - 604800000

  return getData(startOfDayTimestamp, query)
}

export async function getMonthlyData() {
  // FEB IS HARDCODED
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime() + 86400000
  const startOfDay = new Date(2024, 1, 1, 0, 0, 0, 0)
  let startOfDayTimestamp = startOfDay.getTime()
  let output = []

  while (startOfDayTimestamp < todayTimestamp) {
    const data = await getDataEndTime(
      startOfDayTimestamp,
      startOfDayTimestamp + 86400000,
      query2
    ).then((res) => {
      return res
    })
    output.push(data)
    startOfDayTimestamp += 86400000
  }

  return output
}
