import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function AssignedTasks({ assignedTasks, setAssignedTasks, fetchAssignedTasks }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const token = sessionStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const handleStartTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });
      setAssignedTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "IN_PROGRESS" } : t)));
    } catch (err) {
      console.error(err);
      alert("Error starting task");
    }
  };

  const handleSubmitTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "PENDING" }),
      });
      setAssignedTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "PENDING", showSubmitBox: false } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Error submitting task");
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Credits</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.length > 0 ? (
              assignedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.category}</td>
                  <td>{task.creditsOffered}</td>
                  <td>{task.deadline?.split?.("T")[0] || task.deadline}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === "ALLOCATED" && (
                      <Button variant="primary" size="sm" onClick={() => handleStartTask(task.id)}>
                        Start Task
                      </Button>
                    )}
                    {task.status === "IN_PROGRESS" && (
                      <>
                        {!task.showSubmitBox && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() =>
                              setAssignedTasks((prev) =>
                                prev.map((t) => (t.id === task.id ? { ...t, showSubmitBox: true } : t))
                              )
                            }
                          >
                            Submit Task
                          </Button>
                        )}
                        {task.showSubmitBox && (
                          <Button variant="success" size="sm" onClick={() => handleSubmitTask(task.id)}>
                            Submit for Review
                          </Button>
                        )}
                      </>
                    )}
                    {task.status === "PENDING" && <span className="text-warning fw-bold">Awaiting Review</span>}
                    <Button variant="info" size="sm" className="ms-2" onClick={() => handleViewTask(task)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No tasks assigned to you.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask ? (
            <>
              <p><strong>Title:</strong> {selectedTask.title}</p>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Category:</strong> {selectedTask.category}</p>
              <p><strong>Credits:</strong> {selectedTask.creditsOffered}</p>
              <p><strong>Deadline:</strong> {selectedTask.deadline?.split?.("T")[0] || selectedTask.deadline}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
            </>
          ) : (
            <p>No task selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
