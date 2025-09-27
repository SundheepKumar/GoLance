import { useEffect, useState } from "react";
import { Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [bids, setBids] = useState([]);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState({
    id: null,
    title: "",
    description: "",
    category: "",
    creditsOffered: 0,
    deadline: "",
    status: "PENDING",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // JWT token

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // Fetch tasks posted by user
  const fetchTasks = async () => {
    if (!user || !token) {
      alert("You must be logged in to view your tasks.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/tasks/user/${user.id}`, {
        headers,
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // Fetch bids placed by user
  const fetchBids = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bids/user/${user.id}`, {
        headers,
      });
      const data = await res.json();
      setBids(data);
    } catch (err) {
      console.error("Failed to fetch bids", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchBids();
  }, []);

  const handleDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${deleteTaskId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        alert("Task deleted successfully!");
        setShowDeleteModal(false);
        setDeleteTaskId(null);
        fetchTasks();
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const handleEditClick = (task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${editTask.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editTask),
      });
      if (res.ok) {
        alert("Task updated successfully!");
        setShowEditModal(false);
        fetchTasks();
      } else {
        alert("Failed to update task");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  const goToHome = () => navigate("/home");

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Dashboard</h2>

      <Tabs defaultActiveKey="tasks" id="my-tasks-tabs" className="mb-3">
        {/* ---------------- Tasks Posted by Me ---------------- */}
        <Tab eventKey="tasks" title="Tasks Posted by Me">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Credits</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.category}</td>
                  <td>{task.creditsOffered}</td>
                  <td>{task.deadline}</td>
                  <td>{task.status}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/tasks/${task.id}/bids`)}
                    >
                      View Bids
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(task.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tab>

        {/* ---------------- Bids Placed by Me ---------------- */}
        <Tab eventKey="bids" title="Bids Placed by Me">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Credits Offered</th>
                <th>Description</th>
                <th>Estimated Days</th> {/* NEW */}
                <th>Bid ID</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.taskId}</td>
                  <td>{bid.credits}</td>
                  <td>{bid.description}</td>
                  <td>{bid.estimatedDays}</td> {/* NEW */}
                  <td>{bid.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tab>
      </Tabs>

      {/* ---------------- Edit Task Modal ---------------- */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editTask.title}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editTask.description}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={editTask.category}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Credits Offered</Form.Label>
              <Form.Control
                type="number"
                name="creditsOffered"
                value={editTask.creditsOffered}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={editTask.deadline}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={editTask.status}
                onChange={handleEditChange}
              >
                <option value="PENDING">PENDING</option>
                <option value="OPEN">OPEN</option>
                <option value="ALLOCATED">ALLOCATED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={saveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------- Delete Confirmation Modal ---------------- */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="mb-4 text-center">
        <Button className="btn btn-primary" onClick={goToHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
