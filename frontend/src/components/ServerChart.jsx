import { CCard, CContainer } from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "./utils/Loading";
import { ChartComponent } from "./utils/Chart";

const ServerChart = ({ server }) => {
  const EndPoint = server.EndPoint;

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const period = "1d";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}server/${EndPoint}/history/${period}`;
        const data = await axios.get(url);

        if (data.status === 200) {
          const response = data.data;
          console.log("response", response);

          setChartData(response);
          setLoading(false);
        } else {
          setError("Error fetching history data.Data");
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [EndPoint]);

  function initialData() {
    const transformedArray = [];

    chartData.forEach((obj) => {
      const transformedObj = {
        time: obj.timestamp,
        value: obj.clients,
      };

      transformedArray.push(transformedObj);
    });

    return transformedArray;
  }

  // map data to chart. clients -> value and timestamp -> time

  //   const initialData = [
  //     { time: "2018-12-22", value: 32.51 },
  //     { time: "2018-12-23", value: 31.11 },
  //     { time: "2018-12-24", value: 27.02 },
  //     { time: "2018-12-25", value: 27.32 },
  //     { time: "2018-12-26", value: 25.17 },
  //     { time: "2018-12-27", value: 28.89 },
  //     { time: "2018-12-28", value: 25.46 },
  //     { time: "2018-12-29", value: 23.92 },
  //     { time: "2018-12-30", value: 22.68 },
  //     { time: "2018-12-31", value: 22.67 },
  //   ];

  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <CContainer>
            <CCard>
              <ChartComponent data={initialData()}></ChartComponent>
            </CCard>
          </CContainer>
        </div>
      )}
    </div>
  );
};

export default ServerChart;
