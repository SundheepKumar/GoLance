import React from "react";
import golanceLogo from "../assets/golance_logo.png";

export default function Header({ user }) {
  return (
    <header>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#0d6efd" }}>
        <div className="container-fluid">
          {/* Logo + Brand */}
          <a className="navbar-brand d-flex align-items-center text-white" href="#">
            <img src={golanceLogo} alt="golance logo" height="40" className="me-2" />
            <span className="fw-bold fs-5">GoLance</span>
          </a>

          {/* Right side: user avatar + name */}
          {user && (
            <div className="d-flex align-items-center text-white ms-auto">
              <span className="fw-semibold me-2">{user.username}</span>
              <img
                src={`https://ui-avatars.com/api/?name=${user.username}&background=0d6efd&color=fff`}
                alt="avatar"
                className="rounded-circle "
                style={{ width: 36, height: 36,  border: "2px solid white", cursor: "pointer" }}
              />
              
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
