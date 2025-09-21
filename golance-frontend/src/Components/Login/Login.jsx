import React, { useState } from "react";
import Header from "../Header";

const mockLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.endsWith("@university.edu") && password === "demo123") resolve({ success: true });
      else reject({ message: "Invalid campus email or password." });
    }, 1000);
  });
};

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await mockLogin(email, password);
      onLogin && onLogin(res);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
    <Header />
     <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <div className="text-center mb-3">
          <i className="bi bi-mortarboard-fill" style={{ fontSize: 44, color: "#1a237e" }} />
          <h4 className="fw-bold mt-2 mb-3">GoLance Campus Login</h4>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Campus Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
          {error && (
            <div className="alert alert-danger p-2 mt-3 mb-0 text-center">{error}</div>
          )}
        </form>
        <div className="d-flex justify-content-between mt-3">
          <a href="/forgot-password" className="small link-primary">Forgot Password?</a>
          <a href="/signup" className="small link-primary">New user? Signup</a>
        </div>
      </div>
    </div>
    </>
   
  );
}
