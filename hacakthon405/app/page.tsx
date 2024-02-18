"use client";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import LeftColumn from "./leftColumn";
import RightColumn from "./rightColumn";
import { createData, getDayData } from "./actions"

export default function Home() {
  const onButtonClick = () => {
    console.log("??");
  };
  useEffect(() => {
    const interval = setInterval(() => {
      // Code to run every 5 seconds
      invoke<string>("on_button_clicked")
        .then((value) => {
          // console.log("TRIGGERED WITHIN REACT", value)
          createData(value)
        })
        .catch(() => {
          console.log("TRIGGERED WITHIN")
        })
    }, 5000) // 5000 milliseconds = 5 seconds

    // Cleanup function to clear the interval when component unmounts or effect re-runs
    return () => clearInterval(interval)
  }, [])

  const onButtonClick = () => {
    getDayData()
  }

  return (
    <div className='w-screen h-screen bg-gray-200'>
      <div className='flex'>
        <div className='bg-slate-950 h-screen w-[400px] flex-none '>
          <LeftColumn />
        </div>
        <div className='flex-1 bg-slate-900 h-screen p-4'>
          <RightColumn />
        </div>
      </div>
    </div>
  );
}
