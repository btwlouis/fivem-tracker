// Navbar.jsx
import React from "react";
import { CContainer, CNavbar, CNavbarBrand } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilStorage } from "@coreui/icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <CNavbar className="bg-body-tertiary">
        <CContainer>
          <CNavbarBrand
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}>
            <CIcon icon={cilStorage} size="lg" className="me-2" />
            FiveM Insights
          </CNavbarBrand>
        </CContainer>
      </CNavbar>
    </div>
  );
};

export default Navbar;
