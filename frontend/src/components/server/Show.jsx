import React, { useEffect, useState } from "react";
import axios from "axios";
import { getServerIconURL, removeColors } from "../../helpers";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import ServerChart from "./ServerChart";
import Loading from "../utils/Loading";
import { useNavigate } from "react-router-dom";

const Server = () => {
  // get id from    path: "/server/:id", browser router
  const id = window.location.pathname.split("/")[2];
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

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

        // get from https://servers-frontend.fivem.net/api/servers/single/775epa
        const serverInfo = await axios.get(
          `https://servers-frontend.fivem.net/api/servers/single/${newData.joinId}`
        );

        if (serverInfo.status !== 200) {
          throw new Error("Error fetching server info");
        }

        const serverData = serverInfo.data;

        newData.players = serverData.Data.players;
        newData.resources = serverData.Data.resources;

        setBanner(newData.bannerDetail)

        setData(newData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleError = () => {
    console.log("ja")
    setBanner("data:image/webp;base64,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");
  };

  return (
    <div className="h-screen mt-10">
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex justify-center items-center min-h-screen">
            <div className="container mx-auto">
              <button
                onClick={() => navigate("/")}
                className="bg-slate-900  text-white p-4 rounded my-2 ">
                <FaArrowLeft />
              </button>
              {banner && (
                <img
                  className="rounded mb-1 w-full h-24 object-cover"
                  src={banner}
                  onError={handleError} 
                  alt="Server Banner"
                />
              )}
              <div className="flex bg-slate-900 rounded">
                <div className="flex items-start">
                  <img
                    className="m-3 rounded h-12 w-12 lg:h-24 lg:w-24"
                    src={getServerIconURL(data.joinId, data.iconVersion)}
                    loading="lazy"
                    alt="Server Icon"
                  />
                </div>

                <div className="flex items-start mt-3 text-white flex-col ">
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold">{data.projectName}</p>
                    <p className="text-sm opacity-70">
                      {data.projectDescription}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 max-w-[90%] my-3">
                    {Array.isArray(data.tags) ? (
                      data.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-slate-600 text-white text-sm py-1 px-3 ">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 text-white">
                {data.resources?.length > 0 ? (
                  <div className="bg-slate-900 p-4 rounded h-96 overflow-auto ">
                    <p className="text-lg">
                      Resources ({data.resources?.length})
                    </p>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 my-3">
                      {data.resources.map((resource, index) => (
                        <div
                          key={index}
                          className=" bg-slate-700 px-2 py-1 rounded-md mb-1">
                          <p className="w-auto  rounded ">
                            {resource}
                          </p>
                        </div>
                      ))}
                        </div>
                  </div>
                ) : (
                  <div></div>
                )}

                {data.players?.length > 0 ? (
                  <div className="bg-slate-900 p-4 rounded h-96 overflow-auto ">
                    <p className="text-lg mb-4">Players ({data.players?.length})</p>
                    {data.players.map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-slate-800 p-2 rounded-md mb-1">
                        <div className="bg-slate-700 text-white  px-4 py-2 rounded mb-1">
                          ?
                        </div>
                        <p className="ml-2">{player.name}</p>
                        <p className="ml-auto bg-slate-700 rounded px-2 py-1">
                          {player.id}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <div className="p-4 bg-slate-900 my-5 rounded">
                <p className="text-lg mb-4 text-white">Server Stats</p>
                <ServerChart />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Server;
