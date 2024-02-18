"use client"
import React, { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"

const PieChart = ({ activityList }: any) => {
  const chartContainer = useRef(null)
  const [chart, setChart] = useState<any>(null)

  // { application: 'Code', totalSeconds: 180, timeString: '3 minute(s)' },
  // { application: 'Discord', totalSeconds: 10, timeString: '<1 minute' }
  // activityList

  useEffect(() => {
    const sortedActivityList = [...activityList].sort(
      (a, b) => b.totalSeconds - a.totalSeconds
    )
    const labels = sortedActivityList
      ?.slice(0, 5)
      .map((obj: any) => obj.application)
    const values = sortedActivityList
      ?.slice(0, 5)
      .map((obj: any) => obj.totalSeconds)
    //@ts-ignore
    var ctx = document.getElementById("myChart").getContext("2d")
    var myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            borderColor: ["#16a34a", "#06b6d4", "#1d4ed8"],
            backgroundColor: ["#16a34a", "#06b6d4", "#1d4ed8"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {},
        color: "white",
      },
    })

    setChart(myChart)
    //@ts-ignore
  }, [])

  useEffect(() => {
    //console.log("ACTIVITY CHANGING IN LEFT COLUMN")
    if (chart) {
      const sortedActivityList = [...activityList].sort(
        (a, b) => b.totalSeconds - a.totalSeconds
      )
      const labels = sortedActivityList
        ?.slice(0, 5)
        .map((obj: any) => obj.application)
      const values = sortedActivityList
        ?.slice(0, 5)
        .map((obj: any) => obj.totalSeconds)
      chart.data.labels = labels
      chart.data.datasets[0].data = values
      chart.update()
    }
  }, [activityList])

  /*useEffect(() => {
    //@ts-ignore
    var ctx = document.getElementById("myChart").getContext("2d")
    var myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Discord", "LinkedIn", "YouTube"],
        datasets: [
          {
            data: [15, 10, 6],
            borderColor: ["#16a34a", "#06b6d4", "#1d4ed8"],
            backgroundColor: ["#16a34a", "#06b6d4", "#1d4ed8"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {},
        color: "white",
      },
    })
    //@ts-ignore
  }, [])*/

  return (
    <>
      <canvas id="myChart" className="text-white">
        {" "}
      </canvas>
      <h1></h1>
    </>
  )
}

export default PieChart
