import React from "react";
import { CContainer, CRow, CCol, CForm, CFormInput } from "@coreui/react";
import { cilStorage } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const Header = (props) => {
  return (
    <CContainer className="px-4">
      <CRow className="justify-content-center align-items-center mt-5 mb-5">
        <CCol xs="12" lg="6" className="text-center">
          <h1>
            <CIcon icon={cilStorage} size="xxl" className="me-2" />
            FiveM Insights
          </h1>
          <p>
            Unlock the secrets of FiveM servers with detailed insights and
            analytics. Discover more about your favorite servers than ever
            before.
          </p>
          <CForm className="d-flex mt-5">
            <CFormInput
              type="search"
              className="me-2"
              placeholder="Search for a server..."
              onChange={(e) =>
                props.onSearchChange && props.onSearchChange(e.target.value)
              }
            />
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Header;
