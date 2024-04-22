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

const ServerInfo = ({ server }) => {
  const data = server.Data;
  const EndPoint = server.EndPoint;

  if (!data) return null;

  return (
    <CContainer>
      <CRow className="mt-4">
        <CCol sm="12">
          <CCard>
            <CCardBody>
              <div className="d-flex">
                <CImage src={data.serverIconUrl} width={96} height={96} />
                <div className="d-block ms-3">
                  <CCardTitle
                    dangerouslySetInnerHTML={{
                      __html: formatHostname(data.hostname),
                    }}
                  />
                  <CCardText>
                    <CIcon icon={cilUserPlus} className="me-1" />
                    <strong>Players:</strong> {data.clients}/
                    {data.sv_maxclients}
                  </CCardText>

                  <CButton
                    color="primary"
                    href={`https://cfx.re/join/${EndPoint}`}
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
                  <CIcon icon={cilTerminal} className="me-1" />
                  <strong>Resources (total: {data.resources.length}):</strong>
                  <br />
                  {data.resources.map((resource) => (
                    <span className="badge bg-primary me-1">{resource}</span>
                  ))}
                </CCardText>
                <CCardText>
                  <CIcon icon={cilUser} className="me-1" />
                  <strong>Players: (total: {data.players.length}):</strong>
                  <br />
                  {data.players.map((player) => (
                    <span className="badge bg-primary me-1">{player.name}</span>
                  ))}
                </CCardText>
                <CCardText>
                  <CIcon icon={cilClock} className="me-1" />
                  <strong>Last Seen:</strong> {formatDate(data.lastSeen)}
                </CCardText>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <CIcon icon={cilUser} className="me-1" />

                    <span>Owner: {data.ownerName}</span>
                    <CImage
                      src={data.ownerAvatar}
                      width="50"
                      height="50"
                      className="ms-2"
                    />
                  </div>

                  <CButton
                    color="primary"
                    href={data.ownerProfile}
                    target="_blank">
                    Visit Owner's Profile
                  </CButton>
                </div>
                <CProgress
                  className="mt-3"
                  color={getColorForPercentage(
                    calculatePercentage(data.clients, data.sv_maxclients)
                  )}
                  variant="striped"
                  animated
                  value={calculatePercentage(data.clients, data.sv_maxclients)}
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
