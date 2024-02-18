import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const localizer = momentLocalizer(moment);

export default function RightColumn() {
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
  ]);

  return (
    <>
      <div className='h-full justify-center pt-16 w-full'>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 600 }}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='secondary' className='absolute bottom-4 right-4'>
              Chat With Your Data
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[625px]'>
            <DialogHeader>
              <DialogTitle>Chat With Your Data</DialogTitle>
              <DialogDescription>
                Talk to your personal AI assistant, who understands your entire
                schedule.
              </DialogDescription>
            </DialogHeader>
            <div className='w-[580px] mx-auto'>
              <div className='w-full mx-auto'>
                {/* Chat Messages */}
                <div className='flex justify-start'>
                  <div className='bg-gray-200 p-2 rounded-lg max-w-xs'>
                    <p className='text-sm text-black'>Left side chat message</p>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <div className='bg-blue-500 text-white p-2 rounded-lg max-w-xs'>
                    <p className='text-sm'>Right side chat message</p>
                  </div>
                </div>
                {/* Add more chat messages here */}
              </div>
            </div>
            <div className='mx-auto overflow-y-auto'>
              {messages.map((message: any, index: any) => {
                console.log(message);
                return (
                  <div
                    key={index}
                    className={`${
                      message.name === "chat" ? "bg-green-700" : "bg-gray-800"
                    } p-2 rounded-lg my-2 mx-2 ${
                      message.name === "chat" ? "justify-left" : "justify-right"
                    }`}
                  >
                    <p className='text-sm'>{message.message}</p>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
