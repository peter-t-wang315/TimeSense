"use client"
import Image from "next/image"
import { invoke } from "@tauri-apps/api/tauri"
import { useEffect } from "react"
import LeftColumn from "./leftColumn"
import RightColumn from "./rightColumn"
import {
  createData,
  getDailyData,
  getWeeklyData,
  getMonthlyData,
} from "./actions"

export default function Home() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Code to run every 5 seconds
      invoke<string>("on_button_clicked")
        .then((value) => {
          // console.log("TRIGGERED WITHIN REACT", value)
          console.log("Value:", value)
          if (!(value[0] === "BROKEN")) {
            createData(value)
          }
        })
        .catch(() => {
          console.log("TRIGGERED WITHIN")
        })
    }, 5000) // 5000 milliseconds = 5 seconds

    // Cleanup function to clear the interval when component unmounts or effect re-runs
    return () => clearInterval(interval)
  }, [])

  const onButtonClick = async () => {
    // Get the start of the current day
    // const startOfDay = new Date(2024, 1, 15)
    // startOfDay.setHours(0, 0, 0, 0)
    // const startOfDayTimestamp = startOfDay.getTime()
    // const data = await getData(startOfDayTimestamp).then((res) => {
    //   return res
    // })

    const data = await getMonthlyData().then((res) => {
      return res
    })
    console.log("data", data)
  }

  return (
    <div className="w-screen h-screen bg-gray-200">
      <div className="flex">
        <div className="bg-slate-950 h-screen w-[400px] flex-none ">
          <LeftColumn />
        </div>
        <div className="flex-1 bg-slate-900 h-screen p-4">
          <RightColumn />
        </div>
        <div>
          <button onClick={onButtonClick}>CLICK ME MOTHERFUCKER</button>
        </div>
      </div>
    </div>
  )
}
