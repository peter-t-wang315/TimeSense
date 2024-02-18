"use client"
import Chart from "chart.js/auto"
import PieChart from "./pieChart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { svgDictionary } from "./svgDictionary"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification"

export default function LeftColumn({
  activityList,
  timeRestrictions,
  setTimeRestrictions,
  timeRestrictionsDelay,
  setTimeRestrictionDelay,
}: any) {
  // <h1 className="text-bold text-2xl text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>')}</h1>
  const [propsData, setData] = useState<any>(activityList)
  const [safetyIsOpen, setSafetyIsOpen] = useState<any>(false)
  const [timeIsOpen, setTimeIsOpen] = useState<any>(false)

  // console.log(timeRestrictions)
  useEffect(() => {
    setData(activityList)

    const sortedActivityList = [...activityList].sort(
      (a, b) => b.totalSeconds - a.totalSeconds
    )
    const labels = sortedActivityList
      ?.slice(0, 5)
      .map((obj: any) => obj.application)
    const values = sortedActivityList
      ?.slice(0, 5)
      .map((obj: any) => obj.totalSeconds)
  }, [activityList])

  async function getPermissions() {
    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
      const permission = await requestPermission()
      permissionGranted = permission === "granted"
    }
  }

  function convertToHoursMinutes(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600) // Get the whole hours
    const remainingSeconds = totalSeconds % 3600 // Get the remaining seconds
    const minutes = Math.floor(remainingSeconds / 60) // Get the whole minutes
    return { hours, minutes }
  }

  return (
    <>
      <div className="flex flex-col h-[100%]">
        <div className="bg-gray-850 text-white p-8">
          <h1 className=" font-extrabold text-2xl text-white">
            {new Date()
              .toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              .replace(/(\d+)(st|nd|rd|th)/, "$1<sup>$2</sup>")}
          </h1>
        </div>
        <div className=" text-white p-4 pt-0 h-screen">
          <div className="flex flex-col pt-4">
            <h3 className="text-xl text-center font-semibold pb-2">
              My Day So Far
            </h3>
            <PieChart activityList={propsData} />
          </div>
        </div>
        <div className=" text-white p-4 pt-0 h-screen">
          <div className="flex flex-col pt-8 mt-2">
            <h3 className="text-lg text-left font-semibold pb-2">
              Top Activity
            </h3>
            <div className="flex flex-col">
              {[...activityList]
                .sort((a, b) => b.totalSeconds - a.totalSeconds)
                .slice(0, 4)
                .map((activity: any, index: any) => {
                  // {application: 'Visual Studio Code', totalSeconds: 3080, timeString: '51 minute(s)'}

                  // console.log(svgDictionary[activity.application])
                  const formattedTimeString = activity.timeString
                    .replace(/\bhour(s)?\b/g, "h")
                    .replace(/\bminute(s)?\b/g, "m")
                  return (
                    <div
                      className="flex flex-row justify-between pt-3"
                      key={index}
                    >
                      <div className="flex flex-row">
                        <h1 className="text-lg font-light">
                          {activity.application}
                        </h1>
                      </div>
                      <h1 className="pr-3 text-lg font-light">
                        {formattedTimeString}
                      </h1>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
        <div className="flex-grow  text-white flex flex-col justify-end">
          <div className="bg-gray-900 p-3">
            <div className="flex justify-start">
              <div className="flex items-center mr-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/coopercodes.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="ml-4 text-lg font-semibold">Hey, Cooper</h1>
              </div>
              <div className="flex flex-grow items-center">
                <div className="flex-grow"></div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="outline-none">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex items-center">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src="https://github.com/coopercodes.png" />{" "}
                        </Avatar>
                        <span className="ml-2">My Account</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeIsOpen(true)}>
                        Time Restrictions
                      </DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => getPermissions()}>
                        Notification Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSafetyIsOpen(true)}>
                        Data Safety Policy
                        {/*<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>*/}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Log out
                      {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog
                  open={safetyIsOpen}
                  onOpenChange={() => setSafetyIsOpen(false)}
                >
                  <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                      <DialogTitle>Data Safety Policy</DialogTitle>
                      <DialogDescription>
                        <p className="text-xl pt-4 text-gray-100">
                          All data used for tracking your websites is stored
                          100% locally and is impossible for us to recover in
                          any sense.
                        </p>
                        <p className="text-xl pt-4 text-gray-100">
                          You can trust that when you use this service, all of
                          your data is local to your own machine.
                        </p>
                        <p className="text-xl pt-4 text-gray-100">
                          Whenever you want, you can delete the entirety of your
                          data from this service by using the delete button
                          below. You can also download a CSV of the entirety of
                          your data and save it elsewhere.
                        </p>
                        <div className="flex justify-between text-lg pt-4">
                          <Button
                            variant="outline"
                            className="text-sm text-white"
                          >
                            Download Data CSV
                          </Button>
                          <Button variant="destructive" className="text-sm">
                            Delete The Entirety Of My Data, Forever.
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={timeIsOpen}
                  onOpenChange={() => setTimeIsOpen(false)}
                >
                  <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                      <DialogTitle>Time Restrictions</DialogTitle>
                      <DialogDescription>
                        <p className="text-xl pt-4 text-gray-100">
                          Here you can manage the time restrictions you have for
                          the activity on your computer.
                        </p>
                        <p className="text-xl pt-4 text-gray-100 pb-4">
                          Once you reach a restriction, you will receive a
                          notification every minute that you are beyond your
                          time limit.
                        </p>
                        <div className="flex justify-center align-middle">
                          <h3 className="text-xl text-white pr-3 pt-1.5">
                            YouTube
                          </h3>
                          <Input
                            type="text"
                            id="email"
                            placeholder="Enter a total time allowed (ex: 1h 30m)"
                            className="text-white text-xl ml-11 "
                            value={timeRestrictions["YouTube"]}
                            onChange={(e) => {
                              setTimeRestrictions((prevState: any) => ({
                                ...prevState,
                                YouTube: e.target.value,
                              }))
                            }}
                          />
                        </div>

                        <div className="flex justify-center align-middle mt-3">
                          <h3 className="text-xl text-white pr-3 pt-1.5">
                            Instagram
                          </h3>
                          <Input
                            type="text"
                            id="email"
                            placeholder="Enter a total time allowed (ex: 1h 30m)"
                            className="text-white text-xl ml-7"
                            value={timeRestrictions["Instagram"]}
                            onChange={(e) => {
                              setTimeRestrictions((prevState: any) => ({
                                ...prevState,
                                Instagram: e.target.value,
                              }))
                            }}
                          />
                        </div>

                        <div className="flex justify-center align-middle mt-3">
                          <h3 className="text-xl text-white pr-3 pt-1.5">
                            Discord
                          </h3>
                          <Input
                            type="text"
                            id="email"
                            placeholder="Enter a total time allowed (ex: 1h 30m)"
                            className="text-white text-xl ml-12"
                            value={timeRestrictions["Discord"]}
                            onChange={(e) => {
                              setTimeRestrictions((prevState: any) => ({
                                ...prevState,
                                Discord: e.target.value,
                              }))
                            }}
                          />
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
