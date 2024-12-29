import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export const ChartComponent = (props) => {
  const {
    data,
    colors: {
      backgroundColor = "#212631",
      lineColor = "#6261cc",
      textColor = "#fff",
      areaTopColor = "#6261cc",
      areaBottomColor = "rgba(107, 97, 204, 0.4)",
    } = {},
  } = props;

  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: 1500,
      height: 300,
    });
    // chart.applyOptions({
    //   localization: {
    //     timeFormatter: (timestamp) => {
    //       return new Date(timestamp * 1000).toLocaleString("de-DE");
    //     },
    //   },
    // });
    chart.timeScale().fitContent();
    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    //newSeries.setData(data);
    newSeries.setData([
      {
        time: Date.parse("2019-04-11 09:43") / 1000,
        value: 100,
      },
      {
        time: Date.parse("2019-04-11 09:44") / 1000,
        value: 100,
      },
      {
        time: Date.parse("2019-04-11 09:45") / 1000,
        value: 100,
      },
      {
        time: Date.parse("2019-04-11 09:46") / 1000,
        value: 100,
      },
      {
        time: Date.parse("2019-04-11 09:47") / 1000,
        value: 100,
      },
    ]);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div ref={chartContainerRef} />;
};
