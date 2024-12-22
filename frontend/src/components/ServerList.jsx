import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./utils/Loading";
import { removeColors } from "../helpers";
import { FaUserGroup } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { MdStorage } from "react-icons/md";

import { getServerIconURL } from "../helpers";

const ServerList = () => {
  const navigate = useNavigate();
  const [searchValue, onSearchChange] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visibleData, setVisibleData] = useState([]); // Data visible on the screen
  const [page, setPage] = useState(1); // Track current page
  const observerRef = useRef();

  const ITEMS_PER_PAGE = 20; // Number of items to load per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "api/servers"
        );

        if (response.status !== 200) {
          throw new Error("Error fetching data");
        }

        setData(response.data);
        setFilteredData(response.data); // Initially show all data
        setVisibleData(response.data.slice(0, ITEMS_PER_PAGE)); // Show first page
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on search value
    const filtered = data.filter((item) =>
      item.hostname.toLowerCase().includes(searchValue.toLowerCase())
    );

    filtered.forEach((item) => {
      item.hostname = removeColors(item.hostname);
      item.projectName = removeColors(item.projectName);

      item.hostname = item.hostname.slice(0, 120);
      item.projectName = item.projectName.slice(0, 120);
    });

    setFilteredData(filtered);
    setPage(1); // Reset to the first page when filtering
    setVisibleData(filtered.slice(0, ITEMS_PER_PAGE)); // Reset visible data
  }, [searchValue, data]);

  // Load more data when reaching the bottom
  const loadMoreData = useCallback(() => {
    const nextPage = page + 1;
    const newVisibleData = filteredData.slice(0, nextPage * ITEMS_PER_PAGE);

    setVisibleData(newVisibleData);
    setPage(nextPage);
  }, [filteredData, page]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector("#load-more");
    if (target) observer.observe(target);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMoreData]);

  const handleCardClick = (id) => {
    navigate(`/server/${id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto px-4 text-white ">
        <div className="flex flex-col items-start justify-center my-10 text-left">
          <h1 className="text-4xl font-bold flex items-center text-white">
            <MdStorage className="mr-2" />
            FiveM Insights
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Unlock the secrets of FiveM servers with detailed insights and
            analytics. Discover more about your favorite servers than ever
            before.
          </p>
          <form className="flex mt-8 w-full items-center space-x-4">
            {/* Search Input */}
            <input
              type="search"
              className="w-full px-4 py-2 bg-slate-500 text-white border border-slate-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search... (Server Name)"
              onChange={(e) => onSearchChange(e.target.value)}
            />

            {/* Dropdown Menu for Filters */}
            <select
              className="px-4 py-2 bg-slate-500 text-white border border-slate-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const filterType = e.target.value;
                if (filterType === "upvotePower") {
                  const sorted = [...data].sort(
                    (a, b) => b.upvotePower - a.upvotePower
                  );
                  setFilteredData(sorted);
                  setVisibleData(sorted.slice(0, ITEMS_PER_PAGE));
                } else if (filterType === "currentPlayers") {
                  const sorted = [...data].sort(
                    (a, b) => b.playersCurrent - a.playersCurrent
                  );
                  setFilteredData(sorted);
                  setVisibleData(sorted.slice(0, ITEMS_PER_PAGE));
                }
              }}>
              <option value="" disabled selected>
                Filter By
              </option>
              <option value="upvotePower">Upvote Power</option>
              <option value="currentPlayers">Current Players</option>
            </select>

            {/* Reset Filter Button */}
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 bg-slate-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Reset Filters"
              onClick={() => {
                setFilteredData(data);
                setVisibleData(data.slice(0, ITEMS_PER_PAGE));
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="h-132 overflow-y-auto overflow-x-hidden ">
              {visibleData.map((item, index) => (
                <div className="mb-2" key={index}>
                  <div
                    className="flex w-full bg-slate-900 shadow rounded cursor-pointer hover:shadow-lg"
                    onClick={() => handleCardClick(item.id)}>
                    <img
                      className="m-3 rounded h-8 w-8"
                      src={getServerIconURL(item.joinId, item.iconVersion)}
                      loading="lazy"
                      alt="Server Icon"
                    />
                    <div className="p-4 w-full flex items-center relative">
                      {/* Text Section */}
                      <div className="flex flex-col flex-grow truncate">
                        <p className="text-lg font-semibold truncate overflow-hidden whitespace-nowrap max-w-[70%]">
                          {item.projectName}
                        </p>
                        <p className="text-sm opacity-70 truncate overflow-hidden whitespace-nowrap max-w-[70%]">
                          {item.hostname}
                        </p>
                      </div>

                      {/* Right Section */}
                      <div className="absolute right-3 hidden lg:flex items-center space-x-3">
                        <p className="bg-slate-950 rounded p-2  flex items-center">
                          <FaStar className="mr-2" />
                          {item.rank}
                        </p>
                        <p className="bg-slate-950 rounded p-2  flex items-center">
                          <FaUserGroup className="mr-2" />
                          {item.playersCurrent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div id="load-more" className="h-10 w-full"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServerList;
