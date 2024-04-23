import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./utils/Loading";
import { formatHostname } from "../helpers";

import {
  CContainer,
  CImage,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CCol,
  CRow,
} from "@coreui/react";

const ServerList = ({ searchValue }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "servers"
        );

        if (response.status !== 200) {
          throw new Error("Error fetching data");
        }

        setData(response.data);
        setItemsPerPage(response.data.length / 5);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/server/${id}`);
  };

  // Calculate indexes for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredData = currentItems.filter((item) =>
    item.Data.hostname.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <CContainer id="top">
          <h2 className="mt-3">Server List ({filteredData.length})</h2>
          <nav className="d-flex justify-content-end">
            <ul className="pagination">
              {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(
                (number) => (
                  <li
                    key={number}
                    className={`page-item ${
                      currentPage === number + 1 ? "active" : ""
                    }`}>
                    <a
                      onClick={() => paginate(number + 1)}
                      href="#top"
                      className="page-link">
                      {number + 1}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
          {filteredData.map((item, index) => (
            <CRow className="mb-3" key={index}>
              <CCol xs="12">
                <CCard
                  onClick={() => handleCardClick(item.EndPoint)}
                  style={{ cursor: "pointer", flexDirection: "row" }}>
                  <CImage
                    rounded
                    className="mt-3 ms-3"
                    src={item.Data.serverIconUrl}
                    width={96}
                    height={96}
                  />
                  <CCardBody>
                    <CCardTitle
                      dangerouslySetInnerHTML={{
                        __html: formatHostname(item.Data.hostname),
                      }}
                    />
                    <CCardText>
                      <strong>Game Type:</strong> {item.Data.gametype}
                    </CCardText>
                    <CCardText>
                      <strong>Map Name:</strong> {item.Data.mapname}
                    </CCardText>
                    <CCardText>
                      <strong>Players:</strong> {item.Data.clients}/
                      {item.Data.sv_maxclients}
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          ))}
        </CContainer>
      )}
    </div>
  );
};

export default ServerList;
