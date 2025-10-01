import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";

export default function TaskBids() {
  const { taskId } = useParams();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // JWT token
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchBids = async () => {
      if (!token) {
        alert("You must be logged in to view bids.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/bids/tasks/${taskId}`, { headers });
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        setBids(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [taskId, navigate, token]);

  if (loading) return <p>Loading bids...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Bids for Task #{taskId}</h2>

      {bids.length === 0 ? (
        <p>No bids placed yet.</p>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Credits</th>
              <th>Description</th>
              <th>Estimated Days</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td>{bid.bidderName}</td>
                <td>{bid.credits}</td>
                <td>{bid.description}</td>
                <td>{bid.estimatedDays}</td> {/* Display estimated days */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="mt-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
}
