import React, { Component } from "react";
import { CRow, CSpinner } from "@coreui/react";

class Loading extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }
}

export default Loading;
