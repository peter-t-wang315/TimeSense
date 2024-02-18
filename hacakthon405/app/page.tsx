"use client"
import Image from "next/image"
import { invoke } from "@tauri-apps/api/tauri"
import { useEffect, useState } from "react"
import LeftColumn from "./leftColumn"
import RightColumn from "./rightColumn"
import {
  createData,
  getDailyData,
  getWeeklyData,
  getMonthlyData,
} from "./actions"
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification"

function stringToTimestamp(input: string): number {
  const matches = input.match(/(\d+\s*h)?\s*(\d+\s*m)?/)
  if (!matches) {
    throw new Error(
      "Invalid input format. Expected format: 'Xh Ym', 'Xh', or 'Ym'"
    )
  }

  let hours = 0
  if (matches[1]) {
    hours = parseInt(matches[1], 10)
  }

  const minutes = parseInt(matches[matches.length - 1], 10)
  return (hours * 60 + minutes) * 60
}

export default function Home() {
  const [activityList, setActivityList] = useState<any>([])
  const [lastPinged, setLastPinged] = useState<any>("")
  const [hasPingedInitial, setHasPingedInitial] = useState<any>(false)
  const [hasPinged, setHasPinged] = useState({
    Instagram: 0,
    Discord: 0,
    YouTube: 0,
  })
  const [timeRestrictions, setTimeRestrictions] = useState<any>({
    Instagram: "1h 20m",
    Discord: "1m",
    YouTube: "20m",
  })
  const [timeRestrictionsDelay, setTimeRestrictionDelay] = useState<any>({
    Instagram: 0,
    Discord: 0,
    YouTube: 0,
  })

  useEffect(() => {
    async function getDataInitial() {
      const data = await getDailyData().then((res) => {
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
          if (!(value[0] === "BROKEN")) {
            createData(value)
          }

          const data: any = await getDailyData().then((res) => {
            return res
          })
          data.map(async (activity: any, index: number) => {
            let activitySeconds = activity.totalSeconds
            // console.log("MAPPING ACTIVITY: ", activity.application)
            // sendNotification({ title: "TAURI", body: "Tauri is awesome!" })
            if (
              activity.application === "Instagram" ||
              activity.application === "Discord" ||
              activity.application === "YouTube"
            ) {
              let timeLimitSeconds = stringToTimestamp(
                timeRestrictions[activity.application]
              )

              if (
                activitySeconds >= timeLimitSeconds &&
                (activitySeconds - timeLimitSeconds) % 20 == 0 &&
                lastPinged[activity.application] != activitySeconds /*||
                  ((activitySeconds - timeLimitSeconds) % 60 == 0 &&
                    lastPinged == activity.application))*/
              ) {
                if (!hasPingedInitial) {
                  /*sendNotification({
                    title: "TimeSense Alert",
                    body:
                      "You are over your time restriction for " +
                      activity.application +
                      " by " +
                      (activitySeconds - timeLimitSeconds) +
                      "seconds",
                  })*/
                  /*setHasPinged((prevState) => ({
                    ...prevState,
                    [activity.application]: activitySeconds,
                  }))*/
                  setHasPingedInitial(true)
                }

                setLastPinged(activity.application)

                // console.log("OVER OVER OVER")
              }
              /*if (activity.application !== lastPinged) {
                setLastPinged(activity.application)
              }*/
            }
          })
          return data
        })
        .catch(() => {
          console.log("TRIGGERED WITHIN")
        })
      setActivityList(data)
    }, 5000) // 5000 milliseconds = 5 seconds
    setActivityList(activityList)
    // Cleanup function to clear the interval when component unmounts or effect re-runs
    return () => clearInterval(interval)
  }, [])

  const onButtonClick = async () => {
    // Get the start of the current day
    const startOfDay = new Date(2024, 1, 15)
    startOfDay.setHours(0, 0, 0, 0)
    const startOfDayTimestamp = startOfDay.getTime()

    const data = await getMonthlyData().then((res) => {
      return res
    })
    console.log("data", data)
  }

  return (
    <div className="w-screen h-screen bg-gray-200">
      <div className="flex">
        <div className="bg-slate-950 h-screen w-[350px] flex-none ">
          <LeftColumn
            activityList={activityList}
            timeRestrictions={timeRestrictions}
            setTimeRestrictions={setTimeRestrictions}
            timeRestrictionsDelay={timeRestrictionsDelay}
            setTimeRestrictionDelay={setTimeRestrictionDelay}
          />
        </div>
        <div className="flex-1 bg-slate-900 h-screen p-4">
          <RightColumn activityList={activityList} />
        </div>
        {/* <div>
          <button onClick={onButtonClick}>CLICK ME MOTHERFUCKER</button>
        </div> */}
      </div>
    </div>
  )
}
