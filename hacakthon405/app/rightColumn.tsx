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
    async function generateCalendarEvents() {
      function generateEvents(date: any) {
        const events = [
          {
            title: "League of Legends " + "1h 26m",
            start: new Date(date.setHours(13, 0, 0, 0)), // Set start time to 1pm
            end: new Date(date.setHours(14, 0, 0, 0)), // Set end time to 2pm
          },
          {
            title: "Discord",
            start: new Date(date.setHours(14, 0, 0, 0)), // Set start time to 2pm
            end: new Date(date.setHours(15, 0, 0, 0)), // Set end time to 3pm
          },
          {
            title: "Instagram",
            start: new Date(date.setHours(15, 0, 0, 0)), // Set start time to 3pm
            end: new Date(date.setHours(16, 0, 0, 0)), // Set end time to 4pm
          },
        ]

        return events
      }
      setCalendarEvents([
        ...generateEvents(new Date("2024-02-02")),
        ...generateEvents(new Date("2024-02-03")),
        ...generateEvents(new Date("2024-02-04")),
        ...generateEvents(new Date("2024-02-05")),
        ...generateEvents(new Date("2024-02-06")),
        ...generateEvents(new Date("2024-02-07")),
        ...generateEvents(new Date("2024-02-08")),
        ...generateEvents(new Date("2024-02-09")),
        ...generateEvents(new Date("2024-02-10")),
        ...generateEvents(new Date("2024-02-11")),
        ...generateEvents(new Date("2024-02-12")),
        ...generateEvents(new Date("2024-02-13")),
        ...generateEvents(new Date("2024-02-14")),
        ...generateEvents(new Date("2024-02-15")),
        ...generateEvents(new Date("2024-02-16")),
        ...generateEvents(new Date("2024-02-17")),
      ])
      return generateEvents(new Date("2024-02-01"))
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
                console.log(message)
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
