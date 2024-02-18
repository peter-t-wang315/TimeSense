import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMonthlyData } from "./actions"

const localizer = momentLocalizer(moment)

export default function RightColumn({ activityList }: any) {
  const [messages, setMessages] = useState<any>([
    {
      name: "chat",
      message: "Hey, I'm ChatGPT! Are you interested in XYZ?",
    },
    {
      name: "user",
      message: "Hey, I'm ChatGPT! Are you interested in XYZ?",
    },
    {
      name: "chat",
      message: "Hey, I'm ChatGPT! Are you interested in XYZ?",
    },
    {
      name: "user",
      message: "Hey, I'm ChatGPT! Are you interested in XYZ?",
    },
  ])

  const [calendarEvents, setCalendarEvents] = useState<any>([])

  useEffect(() => {
    if (activityList.length > 0) {
      const sortedActivityList = [...activityList].sort(
        (a, b) => b.totalSeconds - a.totalSeconds
      )

      const newCalendarEvents = [...calendarEvents]
      newCalendarEvents.splice(-3)
      const startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      let currentHour = 1
      console.log("sorted activityList", sortedActivityList)

      sortedActivityList.slice(0, 3).map((item, index) => {
        const formattedTimeString = item.timeString
          .replace(/\bhour(s)?\b/g, "h")
          .replace(/\bminute(s)?\b/g, "m")

        // Add calendar event for the current item
        newCalendarEvents.push({
          title: item.application + " " + formattedTimeString,
          start: startDate.setHours(currentHour),
          end: startDate.setHours(currentHour + 1),
        })

        currentHour += 1
      })

      console.log("iausd", newCalendarEvents)
      // Update the state with the newCalendarEvents array
      setCalendarEvents(newCalendarEvents)
    }
  }, [activityList])

  useEffect(() => {
    async function generateCalendarEvents() {
      const monthData = await getMonthlyData().then((res) => {
        return res
      })
      let currentDate = new Date(2024, 1, 1, 0, 0, 0, 0)
      currentDate.setDate(currentDate.getDate() - 1)

      const modifiedData = monthData.flatMap((list) => {
        currentDate.setDate(currentDate.getDate() + 1)
        let currentHour = 1

        return list.map((item) => {
          const newItem = {
            title: item.application + " " + item.timeString,
            start: new Date(currentDate.setHours(currentHour)),
            end: new Date(currentDate.setHours(currentHour + 1)),
          }
          currentHour++
          return newItem
        })
      })

      console.log("Modi", modifiedData)
      setCalendarEvents(modifiedData)
      return modifiedData[0]
    }

    generateCalendarEvents()
  }, [])

  return (
    <>
      <div className="h-full justify-center pt-6 w-full">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, maxWidth: 1050 }}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="absolute bottom-4 right-4">
              Chat With Your Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Chat With Your Data</DialogTitle>
              <DialogDescription>
                Talk to your personal AI assistant, who understands your entire
                schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="w-[580px] mx-auto">
              <div className="w-full mx-auto">
                {/* Chat Messages */}
                <div className="flex justify-start">
                  <div className="bg-gray-200 p-2 rounded-lg max-w-xs">
                    <p className="text-sm text-black">Left side chat message</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                    <p className="text-sm">Right side chat message</p>
                  </div>
                </div>
                {/* Add more chat messages here */}
              </div>
            </div>
            <div className="mx-auto overflow-y-auto">
              {messages.map((message: any, index: any) => {
                return (
                  <div
                    key={index}
                    className={`${
                      message.name === "chat" ? "bg-green-700" : "bg-gray-800"
                    } p-2 rounded-lg my-2 mx-2 ${
                      message.name === "chat" ? "justify-left" : "justify-right"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
