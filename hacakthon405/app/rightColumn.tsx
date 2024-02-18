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

const OPENAI_API_KEY = ""

export const LoadingSpinner = ({ className }: any) => {
  ;<>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"animate-spin " + className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  </>
}

export default function RightColumn({ activityList }: any) {
  const [messageInput, setMessageInput] = useState<any>("")
  const [showSpinner, setShowSpinner] = useState(false)

  const [messages, setMessages] = useState<any>([
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "Hey, I'm your personal AI assitant to help you better understand your schedule, and how to use your time more effectively.",
        },
      ],
    },
  ])

  async function getChatGPTResponse(textInput: string) {
    setMessageInput("")
    setMessages((prevMessages: any) => [
      ...prevMessages,
      {
        role: "user",
        content: [
          {
            type: "text",
            text: textInput,
          },
        ],
      },
    ])
    const requestData = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Be a helpful assistant for time management, productivty, and relaed topics. Be relatively concise in your answers as the window you are chatting in is small. Make sure to look at the users SCHEDULE CONTEXT for data on how to help them. Scheduled events are structured like { title: 'name of event', start: starting timestamp, end: ending timestamp}",
        },
        ...messages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${textInput}  

                  SCHEDULE CONTEXT
                  ${JSON.stringify(calendarEvents)}`,
            },
          ],
        },
      ],
    }
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            role: "assistant",
            content: [
              {
                type: "text",
                text: data.choices[0].message.content,
              },
            ],
          },
        ])
        setShowSpinner(false)
      })
      .catch((error) => {
        setShowSpinner(false)
        console.error("Error:", error)
      })
  }

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
      // console.log("sorted activityList", sortedActivityList)

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

      // console.log("iausd", newCalendarEvents)
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

  const handleKeyPress = (e: any) => {
    // Check if the Enter key was pressed
    if (e.key === "Enter") {
      // Call the function to send the message
      setShowSpinner(true)
      setMessageInput("")
      getChatGPTResponse(messageInput)
    }
  }
  console.log(messageInput)

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
          <DialogContent className="sm:max-w-[625px] h-[650px]">
            <DialogHeader>
              <DialogTitle>Chat With Your Data</DialogTitle>
              <DialogDescription>
                Talk to your personal AI assistant, who understands your entire
                schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="w-[580px] mx-auto">
              <div className="w-full mx-auto h-[550px] max-h-[550px]  flex flex-col">
                {/* Chat Messages */}
                <Button
                  className="w-[120px] text-sm mb-4"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => {
                    setMessages([])
                  }}
                >
                  Clear Chat
                </Button>
                <div></div>
                <div className="h-[540px] max-h-[540px] overflow-y-auto border-t-slate-800 border-t-2">
                  {messages.map((message: any, index: any) => (
                    <div
                      key={index}
                      className={
                        message.role === "assistant"
                          ? "flex justify-start"
                          : "flex justify-end"
                      }
                    >
                      <div
                        className={
                          message.role === "assistant"
                            ? "bg-gray-200 p-2 text-black rounded-lg max-w-xs mt-3"
                            : "bg-blue-500 text-white p-2 rounded-lg max-w-xs mt-3"
                        }
                      >
                        <p className="text-sm">{message.content[0].text}</p>
                      </div>
                    </div>
                  ))}
                  {showSpinner ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={"animate-spin"}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <> </>
                  )}
                </div>
                <div className="flex flex-grow w-full max-w-xl items-center space-x-2 mt-4">
                  <Input
                    type="text"
                    placeholder="Send a message..."
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value)
                      console.log(messages)
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    onClick={() => {
                      setShowSpinner(true)
                      setMessageInput("")
                      getChatGPTResponse(messageInput)
                    }}
                  >
                    Send Message
                  </Button>
                </div>
                {/* Add more chat messages here */}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
