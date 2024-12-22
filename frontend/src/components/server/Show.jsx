import React, { useEffect, useState } from "react";
import axios from "axios";
import { getServerIconURL, removeColors } from "../../helpers";
import { FaArrowLeft } from "react-icons/fa";
import ServerChart from "./ServerChart";

const Server = () => {
  // get id from    path: "/server/:id", browser router
  const id = window.location.pathname.split("/")[2];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}api/server/${id}`
        );

        if (response.status !== 200) {
          throw new Error("Error fetching data");
        }

        const newData = response.data;

        newData.tags = JSON.parse(newData.tags);
        newData.hostname = removeColors(newData.hostname);
        newData.projectName = removeColors(newData.projectName);

        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto">
        <button
          onClick={() => window.history.back()}
          className="bg-slate-900  text-white p-4 rounded my-2 ">
          <FaArrowLeft />
        </button>
        <img
          className="rounded mb-1 w-full h-24 object-cover"
          src={data.bannerDetail}
          alt="Server Banner"
        />
        <div className="flex bg-slate-900 rounded">
          <div className="flex items-start">
            <img
              className="m-3 rounded h-24 w-24"
              src={getServerIconURL(data.joinId, data.iconVersion)}
              loading="lazy"
              alt="Server Icon"
            />
          </div>

          <div className="flex items-start mt-3 text-white flex-col ">
            <div className="flex flex-col">
              <p className="text-2xl font-bold">{data.projectName}</p>
              <p className="text-sm opacity-70">{data.projectDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2 max-w-[70%] my-3">
              {Array.isArray(data.tags) ? (
                data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-500 text-white text-sm py-1 px-3 ">
                    {tag}
                  </span>
                ))
              ) : (
                <span></span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 text-white">
          <div className="bg-slate-900 p-4 rounded">
            <p className="text-lg">Resources ({data.resources?.length})</p>
          </div>
          <div className="bg-slate-900 p-4 rounded">
            <p className="text-lg">Players ({data.players?.length})</p>
          </div>
        </div>

        <div className="flex bg-slate-900 mt-3">
          <ServerChart />
        </div>
      </div>
    </div>
  );
};

export default Server;
