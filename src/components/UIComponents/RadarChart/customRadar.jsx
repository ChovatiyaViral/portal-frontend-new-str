import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from "chart.js";
import { get, map } from "lodash";
import React from "react";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const CustomRadarChart = (props) => {
  const { peaty_or_smokey, pear_or_apple, grassy_or_citrus, floral_or_herbal, tofee_or_vanilla, nutty_or_oilly, dried_fruit_or_sherry, woody_or_spicy, body } = get(props, "record", {});
  const { data } = props;

  const [newData, updateNewData] = React.useState({
    labels: [
      ["Peaty/", "Smokey"],
      ["Pear/", "Apple"],
      ["Grass/", "Citrus"],
      ["Floral/", "herbal"],
      ["Toffee/", "vanilla"],
      ["Nutty/", "oilly"],
      ["Dried Fruits/", "Sherry"],
      ["Woody/", "Spicy"],
      ["Body", ""],
    ],
    datasets: [
      {
        label: [],
        data: [],
        backgroundColor: "rgba(68, 63, 95, 0.8)",
        borderColor: "rgba(68, 63, 95, 0.8)",
        borderWidth: 0,
        pointBackgroundColor: "transparent",
        pointHoverBorderColor: "#443F5F",
      },
    ],
  });

  const getDataSet = () => {
    if (get(props, "data")) {
      return map(get(props, "data", []), function (o) {
        return o === 0 ? o + 0.3 : o;
      });
    }
    return [
      Number(get(props, "record.peaty_or_smokey", 0)) === 0 ? Number(get(props, "record.peaty_or_smokey", 0)) + 0.3 : Number(get(props, "record.peaty_or_smokey", 0)),
      Number(get(props, "record.pear_or_apple", 0)) === 0 ? Number(get(props, "record.pear_or_apple", 0)) + 0.3 : Number(get(props, "record.pear_or_apple", 0)),
      Number(get(props, "record.grassy_or_citrus", 0)) === 0 ? Number(get(props, "record.grassy_or_citrus", 0)) + 0.3 : Number(get(props, "record.grassy_or_citrus", 0)),
      Number(get(props, "record.floral_or_herbal", 0)) === 0 ? Number(get(props, "record.floral_or_herbal", 0)) + 0.3 : Number(get(props, "record.floral_or_herbal", 0)),
      Number(get(props, "record.tofee_or_vanilla", 0)) === 0 ? Number(get(props, "record.tofee_or_vanilla", 0)) + 0.3 : Number(get(props, "record.tofee_or_vanilla", 0)),
      Number(get(props, "record.nutty_or_oilly", 0)) === 0 ? Number(get(props, "record.nutty_or_oilly", 0)) + 0.3 : Number(get(props, "record.nutty_or_oilly", 0)),
      Number(get(props, "record.dried_fruit_or_sherry", 0)) === 0 ? Number(get(props, "record.dried_fruit_or_sherry", 0)) + 0.3 : Number(get(props, "record.dried_fruit_or_sherry", 0)),
      Number(get(props, "record.woody_or_spicy", 0)) === 0 ? Number(get(props, "record.woody_or_spicy", 0)) + 0.3 : Number(get(props, "record.woody_or_spicy", 0)),
      Number(get(props, "record.body", 0)) === 0 ? Number(get(props, "record.body", 0)) + 0.3 : Number(get(props, "record.body", 0)),
    ];
  };

  React.useEffect(() => {
    let dataTemp = {
      labels: [
        ["Peaty/", "Smokey"],
        ["Pear/", "Apple"],
        ["Grass/", "Citrus"],
        ["Floral/", "herbal"],
        ["Toffee/", "vanilla"],
        ["Nutty/", "oilly"],
        ["Dried Fruits/", "Sherry"],
        ["Woody/", "Spicy"],
        ["Body", ""],
      ],
      datasets: [
        {
          label: [],
          data: getDataSet(),
          backgroundColor: "rgba(68, 63, 95, 0.8)",
          borderColor: "rgba(68, 63, 95, 0.8)",
          borderWidth: 1,
          pointBackgroundColor: "transparent",
          pointHoverBorderColor: "#443F5F",
        },
      ],
    };
    updateNewData(dataTemp);
  }, [peaty_or_smokey, pear_or_apple, grassy_or_citrus, floral_or_herbal, tofee_or_vanilla, nutty_or_oilly, dried_fruit_or_sherry, woody_or_spicy, body, data]);

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
          tickLength: 1,
          beginAtZero: true,
          max: 5,
          min: 0,
          stepSize: 0.5,
        },
        pointStyle: false,
        pointLabels: {
          color: "#443F5F",
          fontWidth: "500",
          font: {
            size: 13,
          },
        },
        grid: {
          circular: true,
          color: "#ADADAD",
        },
        anglelines: {
          display: false,
        },
        beginAtZero: true,
        max: 5,
        min: 0,
      },
    },
  };

  return <Radar data={newData} redraw={false} options={radarOptions} />;
};

export default CustomRadarChart;
