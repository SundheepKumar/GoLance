import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // ✅ Use sessionStorage instead of localStorage
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !storedUser) {
        alert("You must be logged in to view profiles.");
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/users/${id}`, { headers });
        if (!res.ok) throw new Error("Failed to fetch user details");
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchUser();
  }, [id, navigate, token]);

  const handleBack = () => navigate("/home");

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary mt-3" onClick={handleBack}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "650px" }}>
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h2 className="text-center mb-4 text-primary">User Profile</h2>
        <div className="mb-3">
          <strong>Username:</strong> {user.username}
        </div>
        <div className="mb-3">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="mb-3">
          <strong>Role:</strong> {user.role}
        </div>
        <div className="mb-3">
          <strong>Department:</strong> {user.department || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Studying Year:</strong> {user.studyingYear || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Skills:</strong> {user.skills || "N/A"}
        </div>

        <button className="btn btn-outline-primary mt-3 w-100" onClick={handleBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
