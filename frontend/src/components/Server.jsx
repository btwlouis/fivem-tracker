import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import Navbar from "./Navbar";
import Loading from "./utils/Loading";
import ServerInfo from "./ServerInfo";
import ServerChart from "./ServerChart";

const Server = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `${process.env.REACT_APP_API_URL}server/${id}`
        );

        if (data.status === 200) {
          const response = data.data;

          setData(response);
          setLoading(false);
        } else {
          setError("Error fetching data.Data");
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <Navbar />
          <ServerInfo server={data} />
        </div>
      )}
    </div>
  );
};

export default Server;
