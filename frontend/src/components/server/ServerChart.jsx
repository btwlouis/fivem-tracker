import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns"; // Import date adapter
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz"; // Use toZonedTime instead of utcToZonedTime
import Loading from "../utils/Loading";

ChartJS.register(...registerables, zoomPlugin);

const ServerChart = () => {
  const id = window.location.pathname.split("/")[2];

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `${process.env.REACT_APP_API_URL}api/server/${id}/history/${period}`;
        const response = await axios.get(url);

        if (response.status === 200) {
          const sortedData = response.data.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setChartData(sortedData);
        } else {
          setError("Error fetching history data");
        }
      } catch (err) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, period]);

  const getTransformedData = () => {
    let previousDate = null;
    const labels = chartData.map((obj) => {
      const date = new Date(obj.timestamp);

      const currentDate = format(date, "dd.MM.yyyy");

      const label =
        currentDate !== previousDate ? `${currentDate}` : format(date, "HH:mm");

      previousDate = currentDate;

      return label;
    });

    const data = chartData.map((obj) => obj.clients);

    return {
      labels,
      datasets: [
        {
          label: "Clients",
          data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          hitRadius: 15,
          tension: 0.2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        type: "category", // Time scale for the x-axis
        time: {
          unit: "hour", // Adjust based on your data
        },
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Clients",
        },
      },
    },
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-start gap-4 mb-4">
        {["24h", "7d", "14d", "30d"].map((p) => (
          <button
            key={p}
            className={`px-4 py-2 rounded ${
              period === p ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePeriodChange(p)}>
            {p}
          </button>
        ))}
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div
          className="w-full"
          style={{
            height: "40vh",
          }}>
          <Line data={getTransformedData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ServerChart;
