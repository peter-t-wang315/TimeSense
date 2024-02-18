"use client"
import Image from "next/image"
import { invoke } from "@tauri-apps/api/tauri"
import { useEffect, useState } from "react"
import LeftColumn from "./leftColumn"
import RightColumn from "./rightColumn"
import { createData, getData } from "./actions"

export default function Home() {
  const [activityList, setActivityList] = useState<any>([])

  useEffect(() => {
    async function getDataInitial() {
      const startOfDay = new Date(2024, 1, 15)
      startOfDay.setHours(0, 0, 0, 0)
      const startOfDayTimestamp = startOfDay.getTime()
      console.log("STart", startOfDayTimestamp)
      const data = await getData(startOfDayTimestamp).then((res) => {
        setActivityList(res)
        return res
      })
    }
    getDataInitial()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      // Code to run every 5 seconds
      const data = await invoke<string>("on_button_clicked")
        .then(async (value) => {
          // console.log("TRIGGERED WITHIN REACT", value)
          createData(value)
          const startOfDay = new Date(2024, 1, 15)
          startOfDay.setHours(0, 0, 0, 0)
          const startOfDayTimestamp = startOfDay.getTime()
          console.log("STart", startOfDayTimestamp)
          const data = await getData(startOfDayTimestamp).then((res) => {
            return res
          })
          //console.log(data)
          //console.log("HERE")
          //console.log(activityList)
          return data
          //forceRenderActivityList(activityList)
        })
        .catch(() => {
          console.log("TRIGGERED WITHIN")
        })
      console.log("FUDGEE")
      console.log(data)
      setActivityList(data)
    }, 5000) // 5000 milliseconds = 5 seconds

    // Cleanup function to clear the interval when component unmounts or effect re-runs
    return () => clearInterval(interval)
  }, [])

  function forceRenderActivityList(activityList: any) {
    setActivityList(activityList)
  }

  const onButtonClick = async () => {
    // Get the start of the current day
    const startOfDay = new Date(2024, 1, 15)
    startOfDay.setHours(0, 0, 0, 0)
    const startOfDayTimestamp = startOfDay.getTime()
    console.log("STart", startOfDayTimestamp)
    const data = await getData(startOfDayTimestamp).then((res) => {
      return res
    })
    console.log("data ", data)
  }

  return (
    <div className="w-screen h-screen bg-gray-200">
      <div className="flex">
        <div className="bg-slate-950 h-screen w-[350px] flex-none ">
          <LeftColumn activityList={activityList} />
        </div>
        <div className="flex-1 bg-slate-900 h-screen p-4">
          <RightColumn activityList={activityList} />
        </div>
        {/*<div>
          <button onClick={onButtonClick}>CLICK ME MOTHERFUCKER</button>
        </div>*/}
      </div>
    </div>
  )
}
