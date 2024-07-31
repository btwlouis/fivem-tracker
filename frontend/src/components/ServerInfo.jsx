import {
  CContainer,
  CRow,
  CCol,
  CImage,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CProgress,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilClock,
  cilTerminal,
  cilUserPlus,
  cilChevronDoubleUp,
  cilChevronTop,
  cilVideogame,
  cilCheckCircle,
  cilStorage,
  cilMonitor,
} from "@coreui/icons";
import { formatHostname, getColorForPercentage } from "../helpers";
import { formatDate, calculatePercentage } from "../helpers";
import ServerChart from "./ServerChart";

export function getServerIconURL(joinId, iconVersion) {
  if (joinId && typeof iconVersion === "number") {
    return `https://servers-frontend.fivem.net/api/servers/icon/${joinId}/${iconVersion}.png`;
  }
}

const ServerInfo = ({ server }) => {
  if (!server) return null;

  const data = server;
  console.log(data);

  return (
    <CContainer>
      <CRow className="mt-4">
        <CCol sm="12">
          <CCard>
            <CCardBody>
              <div className="d-flex">
                <CImage
                  src={getServerIconURL(data.joinId, data.iconVersion)}
                  width={96}
                  height={96}
                />
                <div className="d-block ms-3">
                  <CCardTitle
                    dangerouslySetInnerHTML={{
                      __html: formatHostname(data.hostname || "") || "N/A",
                    }}
                  />
                  <CCardText>
                    <CIcon icon={cilUserPlus} className="me-1" />
                    <strong>Players:</strong> {data.playersCurrent}/
                    {data.playersMax}
                  </CCardText>

                  <CButton
                    color="primary"
                    href={`https://cfx.re/join/${data.joinId}`}
                    target="_blank">
                    Join Server
                  </CButton>
                </div>

                <div className="ms-auto">
                  <CCardText>
                    <CIcon
                      icon={cilChevronDoubleUp}
                      className="me-1"
                      size="xl"
                      style={{ "--ci-primary-color": "pink" }}
                    />
                    <strong>Upvote Power:</strong> {data.upvotePower}
                  </CCardText>
                  <CCardText>
                    <CIcon
                      icon={cilChevronTop}
                      className="me-1"
                      size="xl"
                      style={{ "--ci-primary-color": "pink" }}
                    />
                    <strong>Burst Power:</strong> {data.burstPower}
                  </CCardText>
                </div>
              </div>

              <div className="infos mt-3">
                <CCardText>
                  <CIcon icon={cilVideogame} className="me-1" />
                  <strong>Game Type:</strong> {data.gametype}
                </CCardText>
                <CCardText>
                  <CIcon icon={cilStorage} className="me-1" />
                  <strong>Map Name:</strong> {data.mapname}
                </CCardText>
                <CCardText>
                  <CIcon icon={cilMonitor} className="me-1" />
                  <strong>Server Version:</strong> {data.server}
                </CCardText>

                <CCardText>
                  <CIcon icon={cilMonitor} className="me-1" />
                  <strong>IP: </strong> {data.connectEndPoints[0]}
                </CCardText>
                <CCardText>
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  <strong>Supported?</strong>
                  {data.support_status === "supported" ? (
                    <span className="badge bg-success ms-1">Supported</span>
                  ) : (
                    <span className="badge bg-danger ms-1">Not Supported</span>
                  )}
                </CCardText>
                <CCardText>
                  <CIcon icon={cilUser} className="me-1" />
                  <strong>Players: (total: {data.playersCurrent}):</strong>
                  <br />
                  {data.players.map((player) => (
                    <span className="badge bg-primary me-1">{player.name}</span>
                  ))}
                </CCardText>

                <ServerChart server={data} />

                <CProgress
                  className="mt-3"
                  color={getColorForPercentage(
                    calculatePercentage(data.playersCurrent, data.playersMax)
                  )}
                  variant="striped"
                  animated
                  value={calculatePercentage(
                    data.playersCurrent,
                    data.playersMax
                  )}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ServerInfo;
