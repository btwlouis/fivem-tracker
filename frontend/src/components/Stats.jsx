import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(process.env.REACT_APP_API_URL + "stats");

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

  const percentage = ((data.players / data.maxPlayers) * 100).toFixed(0);

  return (
    <div>
      {loading ? (
        ""
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>test</div>
        // <CContainer className="px-4">
        //   <CRow>
        //     <CCol xs={12} md={6}>
        //       <CWidgetStatsC
        //         className="mb-3"
        //         color="primary"
        //         inverse
        //         icon={<CIcon icon={cilStorage} height={36} />}
        //         title="Online Servers"
        //         value={data.servers}
        //       />
        //     </CCol>
        //     <CCol xs={12} md={6}>
        //       <CWidgetStatsC
        //         className="mb-3"
        //         icon={<CIcon icon={cilUserPlus} height={36} />}
        //         color="primary"
        //         inverse
        //         // calculate percentage bar value. data.maxPlayers and data.players
        //         progress={{
        //           value: percentage,
        //         }}
        //         title="Online Players"
        //         value={percentage + "%"}
        //       />
        //     </CCol>
        //   </CRow>
        // </CContainer>
      )}
    </div>
  );
};

export default Stats;
