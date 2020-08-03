import React, { useState, useEffect } from "react";

import numeral from "numeral";
import { Line } from "react-chartjs-2";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0,0a");
          },
        },
      },
    ],
  },
};

const buildChardData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const chartData = buildChardData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(49,143,181,1)",
                borderColor: "#318fb5",
                borderWidth: "1px",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
