import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  createChart,
  LineStyle,
  CrosshairMode,
} from "lightweight-charts";
import Loading from "../utils/Loading";

const ServerChart = () => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const lineSeriesRef = useRef(null);

  const id = window.location.pathname.split("/")[2];

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("24h");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `${process.env.REACT_APP_API_URL}api/server/${id}/history/${period}`;
        const response = await axios.get(url);

        if (response.status === 200) {
          const sortedData = response.data
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
            .map((item) => ({
              time: new Date(item.timestamp).getTime() / 1000,
              value: item.clients,
            }));
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

  useEffect(() => {
    if (chartData && chartContainerRef.current) {
      // Clear previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }

      // Create a new chart instance
      chartInstanceRef.current = createChart(
        chartContainerRef.current,
        {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { type: "solid", color: "transparent" },
            textColor: "#fff",
          },
          grid: {
            vertLines: { visible: false },
            horzLines: { visible: false },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              color: "rgba(255, 255, 255, 0.2)",
              width: 1,
              style: LineStyle.Dotted,
              visible: true,
              labelVisible: true,
            },
            horzLine: {
              color: "rgba(255, 255, 255, 0.2)",
              width: 1,
              style: LineStyle.Dotted,
              visible: true,
              labelVisible: true,
            },
          },
          rightPriceScale: {
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          timeScale: {
            borderColor: "rgba(255, 255, 255, 0.2)",
            rightOffset: 2,
            fixLeftEdge: true,
          },
        }
      );

      lineSeriesRef.current = chartInstanceRef.current.addAreaSeries({
        lineColor: "rgba(29, 78, 216, 1)",
        topColor: "rgba(29, 78, 216, 0.5)",
        bottomColor: "transparent",
        lineWidth: 2,
      });

      lineSeriesRef.current.setData(chartData);

      const firstTime = chartData[0].time;
      const lastTime = chartData[chartData.length - 1].time;
      chartInstanceRef.current.timeScale().setVisibleRange({
        from: firstTime,
        to: lastTime,
      });

      const handleResize = () => {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [chartData]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-start gap-4 mb-4">
        {["24h", "7d", "14d", "30d"].map((p) => (
          <button
            key={p}
            className={`px-4 py-2 rounded text-white ${
              period === p ? "bg-blue-700" : "bg-slate-500"
            }`}
            onClick={() => handlePeriodChange(p)}
          >
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
          ref={chartContainerRef}
          className="w-full bg-slate-900"
          style={{
            height: "45vh",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
};

export default ServerChart;
