import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { apiFetch } from "../api"; // optional helper

export default function TasksPostedByMe({ tasks, setTasks, fetchTasks }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [selectedTaskBids, setSelectedTaskBids] = useState([]);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTask, setReviewTask] = useState(null);
  const [showCreditTransferModal, setShowCreditTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferToUserId, setTransferToUserId] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const userId = user?.id;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ---------- Edit Task ----------
  const handleEditClick = (task) => {
    setEditTask({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      category: task.category || "",
      creditsOffered: task.creditsOffered || 0,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) =>
    setEditTask({ ...editTask, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    if (!editTask) return;
    try {
      await fetch(`http://localhost:8080/api/tasks/${editTask.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: editTask.title,
          description: editTask.description,
          category: editTask.category,
          creditsOffered: Number(editTask.creditsOffered),
          deadline: editTask.deadline,
        }),
      });
      alert("Task updated successfully!");
      setShowEditModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task: " + err.message);
    }
  };

  // ---------- Delete Task ----------
  const handleDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTaskId) return;
    try {
      await fetch(`http://localhost:8080/api/tasks/${deleteTaskId}`, {
        method: "DELETE",
        headers,
      });
      alert("Task deleted successfully!");
      setShowDeleteModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task: " + err.message);
    }
  };

  // ---------- View Bids ----------
  const handleViewBids = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bids/tasks/${taskId}`, {
        headers,
      });
      const data = await res.json();
      setSelectedTaskBids(data.map((b) => ({ ...b, taskId })));
      setShowBidsModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bids: " + err.message);
    }
  };

  // ---------- Allocate Bid ----------
  const handleSelectBid = async (bid) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bids/tasks/${bid.taskId}/allocate/${bid.id}`,
        { method: "POST", headers }
      );
      const updatedTask = await res.json();
      alert(`Bid allocated to ${bid.bidderName} successfully!`);
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      setShowBidsModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error allocating bid: " + err.message);
    }
  };

  // ---------- Review Work ----------
  const handleReviewClick = (task) => {
    setReviewTask(task);
    setShowReviewModal(true);
  };

  // ---------- Update Status ----------
  const updateStatus = async (taskId, newStatus) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      alert(`Status updated to ${newStatus}!`);
      setShowReviewModal(false);

      if (newStatus === "COMPLETED") {
        const task = tasks.find((t) => t.id === taskId);
        const assignedUserId = task.assignedUserId || task.assignedUser?.id;
        setTransferAmount(task.creditsOffered || 0);
        setTransferToUserId(assignedUserId);
        setShowCreditTransferModal(true);
      }

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + err.message);
    }
  };

  // ---------- Wallet Transfer ----------
  const handleCreditTransfer = async () => {
    try {
      await fetch("http://localhost:8080/api/wallet/transfer", {
        method: "POST",
        headers,
        body: JSON.stringify({
          fromUserId: userId,
          toUserId: transferToUserId,
          amount: parseInt(transferAmount, 10),
        }),
      });
      alert("Credits sent successfully!");
      setShowCreditTransferModal(false);
      setTransferAmount(0);
      setTransferToUserId(null);
    } catch (err) {
      console.error(err);
      alert("Error transferring credits: " + err.message);
    }
  };

  return (
    <>
      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Credits</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>View Bids / Assigned</th>
              <th>Review Work</th>
              <th>Delete Task</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td style={{ maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {task.description}
                </td>
                <td>{task.category}</td>
                <td>{task.creditsOffered}</td>
                <td>{task.deadline?.split?.("T")[0] || task.deadline}</td>
                <td>{task.status}</td>

                <td>
                  {task.status === "ALLOCATED" || task.status === "IN_PROGRESS" ? (
                    <span>Assigned to: {task.assignedUserName || task.assignedUser?.username || "—"}</span>
                  ) : (
                    <Button variant="info" size="sm" onClick={() => handleViewBids(task.id)}>
                      View Bids
                    </Button>
                  )}
                </td>

                <td>
                  {task.status === "IN_PROGRESS" || task.status === "PENDING" ? (
                    <Button variant="primary" size="sm" onClick={() => handleReviewClick(task)}>
                      Review Work
                    </Button>
                  ) : (
                    <span>—</span>
                  )}
                </td>

                <td>
                  {task.status === "OPEN" || task.status === "PENDING" ? (
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(task.id)}>
                      Delete
                    </Button>
                  ) : (
                    <span>Assigned task cannot be deleted</span>
                  )}
                </td>

                <td>
                  <Button variant="secondary" size="sm" onClick={() => handleEditClick(task)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Work Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Review Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewTask ? (
            <>
              <h5>{reviewTask.title}</h5>
              <p>{reviewTask.description}</p>
              {/* You can add a file viewer or submission text here if backend stores it */}
              <div style={{ minHeight: 100, border: "1px solid #eee", padding: 10, marginTop: 12 }}>
                {/* placeholder for submission preview */}
                <em>Submission preview (if available)</em>
              </div>
            </>
          ) : (
            <p>No review selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => updateStatus(reviewTask.id, "COMPLETED")}>
            Accept
          </Button>
          <Button variant="warning" onClick={() => updateStatus(reviewTask.id, "IN_PROGRESS")}>
            Request Revision
          </Button>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Credit Transfer Modal */}
      <Modal show={showCreditTransferModal} onHide={() => setShowCreditTransferModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transfer Credits</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to send <strong>{transferAmount}</strong> credits to{" "}
            <strong>{tasks.find((t) => (t.assignedUserId || t.assignedUser?.id) === transferToUserId)?.assignedUserName || "User"}</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreditTransferModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreditTransfer}>
            Send Credits
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal (status removed) */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["title", "description", "category", "creditsOffered", "deadline"].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label className="text-capitalize">{field}</Form.Label>
                <Form.Control
                  type={field === "creditsOffered" ? "number" : field === "deadline" ? "date" : "text"}
                  name={field}
                  value={editTask?.[field] ?? ""}
                  onChange={handleEditChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="success" onClick={saveEdit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Bids Modal */}
      <Modal show={showBidsModal} onHide={() => setShowBidsModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Bids for Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTaskBids.length > 0 ? (
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>Bidder</th>
                  <th>Credits</th>
                  <th>Description</th>
                  <th>Estimated Days</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedTaskBids.map((bid) => (
                  <tr key={bid.id}>
                    <td>{bid.bidderName}</td>
                    <td>{bid.credits}</td>
                    <td>{bid.description}</td>
                    <td>{bid.estimatedDays || "—"}</td>
                    <td>
                      {tasks.find((t) => t.id === bid.taskId)?.status === "ALLOCATED" ? (
                        <span>Assigned to: {tasks.find((t) => t.id === bid.taskId)?.assignedUserName || "—"}</span>
                      ) : (
                        <Button variant="success" size="sm" onClick={() => handleSelectBid(bid)}>Select</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No bids for this task</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBidsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
