"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = () => {
  const chartContainer = useRef(null);

  useEffect(() => {
    //@ts-ignore
    var ctx = document.getElementById("myChart").getContext("2d");
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
    });
    //@ts-ignore
  }, []);

  return (
    <>
      <canvas id='myChart' className='text-white'>
        {" "}
      </canvas>
      <h1></h1>
    </>
  );
};

export default PieChart;
