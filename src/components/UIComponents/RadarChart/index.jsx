import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from "chart.js";
import React from "react";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
  //   const [radarData, setRadarData] = useState({
  //     labels: [],

  //     datasets: [{
  //         backgroundColor: "rgba(249, 196, 103, .6)",
  //         borderColor: "rgba(249, 196, 103, 0)",
  //         pointBackgroundColor: "rgba(249, 196, 103, 0)",
  //         poingBorderColor: "rgba(249, 196, 103, 0)",
  //         pointHoverBackgroundColor: "rgba(249, 196, 103, 0)",
  //         pointHoverBorderColor: "rgba(34, 202, 236, 0)",
  //         data: [2, 9, 3, 5, 2, 3],
  //         color: "rgba(255, 255, 255, 1)",
  //     }]
  // })

  const data = {
    labels: [["Peaty/", "Smokey"], ["Pear/", "Apple"], ["Grass/", "Citrus"], ["Floral/", "herbal"], ["Toffeenanilla"], ["Nutty/", "Jolly"], ["Dried ", "Fruits/", "Sherry"], ["Woody/", "Spicy"]],
    datasets: [
      {
        label: [],
        data: [0, 2, 2, 2, 1.5, 1.5, 2.5, 1.8],
        backgroundColor: "rgba(68, 63, 95, 0.8)",
        borderColor: "rgba(68, 63, 95, 0.8)",
        borderWidth: 0,
        pointBackgroundColor: "transparent",
        pointHoverBorderColor: "#443F5F",
      },
    ],
  };

  const chartRef = React.createRef();

  const radarOptions = {
    startAngle: 0,
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
          tickLength: 7,
        },
        pointStyle: false,
        pointLabels: {
          color: "#443F5F",
          fontWidth: "500",
          font: {
            size: 11,
          },
        },
        grid: {
          circular: true,
          color: "#ADADAD",
        },
        anglelines: {
          display: false,
          // lin
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Radar ref={chartRef} data={data} redraw={true} options={radarOptions} />
    </>
  );
};

export default RadarChart;
