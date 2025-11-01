import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import golanceLogo from "../assets/golance_logo.png";

export default function Header({ user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/home");
  };

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{ backgroundColor: "#0d6efd" }}
      >
        <div className="container-fluid">
          {/* Brand */}
          <Link
            className="navbar-brand d-flex align-items-center text-white"
            to="/home"
          >
            <img
              src={golanceLogo}
              alt="golance logo"
              height="40"
              className="me-2"
            />
            <span className="fw-bold fs-5">GoLance</span>
          </Link>

          {/* Right section */}
          <div className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                {/* 💬 Message Icon */}
                <div
                  className="text-white"
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                  onClick={() => {
                    if (!user) {
                      alert("⚠️ Please login first to view messages!");
                      navigate("/login");
                    } else {
                      navigate("/messages");
                    }
                  }}
                  title="Messages"
                >
                  <i className="bi bi-chat-dots-fill"></i>
                </div>

                {/* Profile Dropdown */}
                <div className="position-relative">
                  <div
                    className="d-flex align-items-center text-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="fw-semibold me-2">{user.username}</span>
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=0d6efd&color=fff`}
                      alt="avatar"
                      className="rounded-circle border border-light"
                      style={{ width: 36, height: 36 }}
                    />
                  </div>

                  {dropdownOpen && (
                    <div
                      className="position-absolute end-0 mt-2 bg-white rounded-3 shadow p-2"
                      style={{ minWidth: "160px", zIndex: 1000 }}
                    >
                      <button
                        className="dropdown-item text-start"
                        onClick={() => {
                          navigate(`/profile/${user.id}`);
                          setDropdownOpen(false);
                        }}
                      >
                        👤 My Profile
                      </button>
                      <button
                        className="dropdown-item text-start"
                        onClick={() => {
                          navigate("/wallet");
                          setDropdownOpen(false);
                        }}
                      >
                        💰 My Wallet
                      </button>
                      <hr className="my-2" />
                      <button
                        className="dropdown-item text-danger text-start"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => {
                  sessionStorage.clear();
                }}
                className="btn btn-light rounded-pill px-4 py-1 fw-semibold shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
