import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import TasksPostedByMe from "./TasksPostedByMe";
import BidsPlacedByMe from "./BidsPlacedByMe";
import AssignedTasks from "./AssignedTasks";
import { apiFetch } from "../api"; // optional if using your custom fetch

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState("posted");
  const [tasks, setTasks] = useState([]);
  const [bids, setBids] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const userId = user?.id;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ---------- Safe fetch functions ----------
  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/user/${userId}`, { headers });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchBids = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bids/user/${userId}`, { headers });
      const data = await res.json();
      setBids(data);
    } catch (err) {
      console.error("Error fetching bids:", err);
    }
  };

  const fetchAssignedTasks = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/user/${userId}/assigned-tasks`, { headers });
      const data = await res.json();
      setAssignedTasks(data);
    } catch (err) {
      console.error("Error fetching assigned tasks:", err);
    }
  };

  // ---------- Fetch data on tab change ----------
  useEffect(() => {
    if (!userId) return;
    if (activeTab === "posted") fetchTasks();
    else if (activeTab === "bids") fetchBids();
    else if (activeTab === "assigned") fetchAssignedTasks();
  }, [activeTab, userId]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Tasks Dashboard</h2>

      {/* ---------- Navigation Buttons ---------- */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button
          variant={activeTab === "posted" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("posted")}
        >
          Tasks Posted By Me
        </Button>

        <Button
          variant={activeTab === "bids" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("bids")}
        >
          Bids Placed By Me
        </Button>

        <Button
          variant={activeTab === "assigned" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("assigned")}
        >
          Tasks Assigned To Me
        </Button>
      </div>

      {/* ---------- Conditional Rendering ---------- */}
      {activeTab === "posted" && (
        <TasksPostedByMe tasks={tasks} setTasks={setTasks} fetchTasks={fetchTasks} headers={headers} />
      )}

      {activeTab === "bids" && (
        <BidsPlacedByMe bids={bids} setBids={setBids} fetchBids={fetchBids} headers={headers} />
      )}

      {activeTab === "assigned" && (
        <AssignedTasks
          assignedTasks={assignedTasks}
          setAssignedTasks={setAssignedTasks}
          fetchAssignedTasks={fetchAssignedTasks}
          headers={headers}
        />
      )}
    </div>
  );
}
