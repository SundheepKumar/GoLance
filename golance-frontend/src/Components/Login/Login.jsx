import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginScreen({ onLogin }) {
  const location = useLocation();
  const [message, setMessage] = useState(
    location.state?.signupSuccess ? "Signup successful! Please login." : null
  );

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Auto-dismiss message after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid username or password");

      const data = await res.json();
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      onLogin && onLogin(data.user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Success message container */}
      {message && (
        <div className="container mt-3">
          <div className="alert alert-success text-center">{message}</div>
        </div>
      )}

      {/* Main login card */}
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ minHeight: "90vh" }}
      >
        <div
          className="card p-4 shadow"
          style={{
            maxWidth: 400,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
          }}
        >
          <div className="text-center mb-3">
            <i
              className="bi bi-mortarboard-fill"
              style={{ fontSize: 44, color: "#1a237e" }}
            />
            <h4 className="fw-bold mt-2 mb-3">GoLance Campus Login</h4>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
            {error && (
              <div className="alert alert-danger p-2 mt-3 mb-0 text-center">
                {error}
              </div>
            )}
          </form>
          <div className="d-flex justify-content-between mt-3">
            <a href="/forgot-password" className="small link-primary">
              Forgot Password?
            </a>
            <a href="/signup" className="small link-primary">
              New user? Signup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
