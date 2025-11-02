import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiFetch } from "../api";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [bids, setBids] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDescription, setBidDescription] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const fetchTasks = async () => {
    try {
      const data = await apiFetch("http://localhost:8080/api/tasks");
      const filtered = data.filter(
        (task) => task.postedBy?.id !== user?.id && task.status === "OPEN"
      );
      setTasks(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async (taskId) => {
    try {
      const data = await apiFetch(
        `http://localhost:8080/api/bids/tasks/${taskId}`
      );
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
    if (!bidAmount || !bidDescription) return alert("Please fill all fields.");

    if (Number(bidAmount) > selectedTask.creditsOffered) {
      return alert(`Bid cannot exceed ${selectedTask.creditsOffered} credits.`);
    }

    // ✅ Check if this user already placed a bid for this task
    const alreadyBid = bids.some(
      (b) =>
        b.userId === user.id ||
        b.bidderId === user.id // for backend naming consistency
    );
    if (alreadyBid) {
      return alert("You have already placed a bid for this task.");
    }

    const payload = {
      userId: user.id,
      credits: Number(bidAmount),
      description: bidDescription,
    };

    try {
      const newBid = await apiFetch(
        `http://localhost:8080/api/bids/tasks/${selectedTask.id}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      // Append new bid and show success
      setBids((prev) => [...prev, newBid]);
      setBidAmount("");
      setBidDescription("");
      setShowBidForm(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error placing bid:", err);
      alert("Error placing bid: " + err.message);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // ✅ Clean helper function
  const hasUserBid = (taskId) =>
    bids.some(
      (b) =>
        (b.userId === user.id || b.bidderId === user.id) &&
        selectedTask?.id === taskId
    );

  return (
    <div className="container my-5">
      <h2 className="mb-3">Open Tasks</h2>
      <p className="text-muted mb-4">
        Showing only tasks that are currently open for bidding.
      </p>

      {loading && <p>Loading tasks...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {tasks.length === 0 && !loading && (
        <p>No open tasks available at the moment. Check back soon! 🚀</p>
      )}

      <div className="row">
        {tasks.map((task) => (
          <div key={task.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm border-1 rounded-3">
              <div className="card-body">
                <h5 className="card-title fw-semibold">{task.title}</h5>
                <p>
                  <strong>Category:</strong> {task.category}
                </p>
                <p>
                  <strong>Credits:</strong> {task.creditsOffered}
                </p>
                <p>
                  <strong>Deadline:</strong> {task.deadline}
                </p>
                <p>
                  <strong>Posted By:</strong> {task.postedBy?.username || "N/A"}
                </p>

                <button
                  className="btn btn-primary mt-2 w-100"
                  onClick={() => handleViewDetails(task)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  {selectedTask.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>
              <div className="modal-body text-dark">
                <p>
                  <strong>Category:</strong> {selectedTask.category}
                </p>
                <p>
                  <strong>Description:</strong> {selectedTask.description}
                </p>
                <p>
                  <strong>Credits:</strong> {selectedTask.creditsOffered}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTask.status}
                </p>
                <p>
                  <strong>Deadline:</strong> {selectedTask.deadline}
                </p>
                <p>
                  <strong>Posted By:</strong>{" "}
                  {selectedTask.postedBy?.username || "N/A"}
                </p>

                {/* ✅ Disable bid form if user already placed a bid */}
                {hasUserBid(selectedTask.id) ? (
                  <div className="alert alert-warning mt-3">
                    ⚠️ You have already placed a bid for this task.
                  </div>
                ) : !showBidForm ? (
                  <button
                    className="btn btn-success mb-3 mt-2"
                    onClick={() => setShowBidForm(true)}
                  >
                    Place a Bid
                  </button>
                ) : (
                  <form onSubmit={handleBidSubmit} className="mb-3">
                    <div className="mb-2">
                      <label className="form-label fw-semibold">
                        Bid Amount
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        value={bidDescription}
                        onChange={(e) => setBidDescription(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">
                      Submit Bid
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}

                <h5 className="mt-4 fw-semibold text-secondary">Previous Bids</h5>
                {bids.length === 0 ? (
                  <p className="text-muted">No bids yet.</p>
                ) : (
                  <div className="row mt-3">
                    {bids.map((bid) => (
                      <div key={bid.id} className="col-md-6 mb-3">
                        <div className="card border-0 shadow-sm rounded-3 h-100">
                          <div className="card-body">
                            <p className="mb-1">
                              <strong>Bidder:</strong> {bid.bidderName}
                            </p>
                            <p className="mb-1">
                              <strong>Credits:</strong> {bid.credits}
                            </p>
                            <p className="text-muted small mb-0">
                              {bid.description || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="p-4 text-center">
                <div
                  className="rounded-circle bg-success text-white mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", fontSize: "2rem" }}
                >
                  ✓
                </div>
                <h4 className="mb-2">Bid Placed Successfully!</h4>
                <p className="text-muted mb-4">
                  Your bid has been submitted for this task.
                </p>
                <button
                  className="btn btn-success px-4 fw-semibold rounded-3"
                  onClick={handleCloseSuccessModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
