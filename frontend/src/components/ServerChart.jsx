import { CCard, CContainer } from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "./utils/Loading";
import { ChartComponent } from "./utils/Chart";

const ServerChart = ({ server }) => {
  const id = server.id;

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const period = "30d";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}server/${id}/history/${period}`;
        const data = await axios.get(url);

        if (data.status === 200) {
          const response = data.data;

          setChartData(response);
          setLoading(false);
        } else {
          setError("Error fetching history data");
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function initialData() {
    const transformedArray = [];

    chartData.forEach((obj) => {
      let date = new Date(obj.timestamp);
      const transformedObj = {
        time: date.getTime() / 1000,
        value: obj.clients,
      };

      transformedArray.push(transformedObj);
    });

    return transformedArray;
  }

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
