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

export function getServerIconURL(joinId, iconVersion) {
  if (joinId && typeof iconVersion === "number") {
    return `https://servers-frontend.fivem.net/api/servers/icon/${joinId}/${iconVersion}.png`;
  }
}

const ServerList = ({ searchValue }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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
    setFilteredData(filtered);
  }, [searchValue, data]);

  const handleCardClick = (id) => {
    navigate(`/server/${id}`);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <CContainer id="top">
          <h2 className="mt-3">Server List ({filteredData.length})</h2>
          {filteredData.map((item, index) => (
            <CRow className="mb-3" key={index}>
              <CCol xs="12">
                <CCard
                  onClick={() => handleCardClick(item.id)}
                  style={{ cursor: "pointer", flexDirection: "row" }}>
                  <CImage
                    rounded
                    className="mt-3 ms-3"
                    src={getServerIconURL(item.joinId, item.iconVersion)}
                    width={96}
                    height={96}
                  />
                  <CCardBody>
                    <CCardTitle
                      dangerouslySetInnerHTML={{
                        __html: formatHostname(item.hostname || "") || "N/A",
                      }}
                    />
                    <CCardText>
                      <strong>Game Type:</strong> {item.gametype}
                    </CCardText>
                    <CCardText>
                      <strong>Map Name:</strong> {item.mapname}
                    </CCardText>
                    <CCardText>
                      <strong>Players:</strong> {item.playersCurrent}/
                      {item.playersMax}
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
