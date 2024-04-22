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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(process.env.REACT_APP_API_URL + "servers");

        if (data.status != 200) {
          return setError("Error fetching data");
        }

        const response = data.data;

        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/server/${id}`);
  };

  const filteredData = data.filter((item) =>
    item.Data.hostname.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <CContainer>
          <h2 className="mt-3">Server List ({filteredData.length})</h2>

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
