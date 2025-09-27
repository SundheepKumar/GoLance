import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [bids, setBids] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDescription, setBidDescription] = useState("");
  const [estimatedDays, setEstimatedDays] = useState(""); // NEW

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  if (!user || !token) {
    alert("You must be logged in to view tasks.");
    window.location.href = "/login";
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tasks", { headers });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bids/tasks/${taskId}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch bids");
      const data = await res.json();
      setBids(data);
    } catch (err) {
      console.error(err);
      setBids([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    fetchBids(task.id);
    setShowBidForm(false);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || !bidDescription || !estimatedDays) return alert("Fill all fields");

    if (Number(bidAmount) > selectedTask.creditsOffered) {
      return alert(`Bid cannot exceed ${selectedTask.creditsOffered} credits`);
    }

    const payload = {
      userId: user.id,
      credits: Number(bidAmount),
      description: bidDescription,
      estimatedDays: Number(estimatedDays), // NEW
    };

    try {
      const res = await fetch(`http://localhost:8080/api/bids/tasks/${selectedTask.id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to place bid");
      }

      const newBid = await res.json();
      setBids((prev) => [...prev, newBid]);
      setBidAmount("");
      setBidDescription("");
      setEstimatedDays(""); // reset
      setShowBidForm(false);
      alert("Bid placed successfully!");
    } catch (err) {
      console.error("Error placing bid:", err);
      alert("Error placing bid: " + err.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">All Tasks</h2>

      {loading && <p>Loading tasks...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {tasks.map((task) => (
          <div key={task.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Credits:</strong> {task.creditsOffered}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Deadline:</strong> {task.deadline}</p>
                <p><strong>Posted By:</strong> {task.postedBy?.username || "N/A"}</p>

                <button className="btn btn-primary mt-2" onClick={() => handleViewDetails(task)}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTask.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedTask(null)}></button>
              </div>
              <div className="modal-body text-dark">
                <p><strong>Category:</strong> {selectedTask.category}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Credits:</strong> {selectedTask.creditsOffered}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                <p><strong>Deadline:</strong> {selectedTask.deadline}</p>
                <p><strong>Posted By:</strong> {selectedTask.postedBy?.username || "N/A"}</p>

                {!showBidForm && (
                  <button className="btn btn-success mb-3 mt-2" onClick={() => setShowBidForm(true)}>
                    Bid
                  </button>
                )}

                {showBidForm && (
                  <form onSubmit={handleBidSubmit} className="mb-3">
                    <div className="mb-2">
                      <label className="form-label">Bid Amount</label>
                      <input type="number" className="form-control" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" value={bidDescription} onChange={(e) => setBidDescription(e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Estimated Days</label>
                      <input type="number" className="form-control" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Submit Bid</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowBidForm(false)}>Cancel</button>
                  </form>
                )}

                <h5>Previous Bids:</h5>
                {bids.length === 0 ? (
                  <p>No bids yet.</p>
                ) : (
                  <ul>
                    {bids.map((bid) => (
                      <li key={bid.id}>
                        <strong>Bidder:</strong> {bid.bidderName},{" "}
                        <strong>Credits:</strong> {bid.credits},{" "}
                        <strong>Description:</strong> {bid.description},{" "}
                        <strong>Estimated Days:</strong> {bid.estimatedDays} {/* NEW */}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedTask(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
