import React from "react";
import golanceLogo from "../assets/golance_logo.png"; // Update path as needed

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#0d6efd" }}>
        <div className="container-fluid">
          {/* Logo + Brand */}
          <a className="navbar-brand d-flex align-items-center text-white" href="#">
            <img src={golanceLogo} alt="golance logo" height="40" className="me-2" />
            <span className="fw-bold fs-5">GoLance</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
