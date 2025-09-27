// src/pages/PostTask.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    creditsOffered: "",
    category: "",
    deadline: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // logged-in user
  const token = localStorage.getItem("token"); // JWT token

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to post a task.");
      navigate("/login");
      return;
    }

    const taskData = {
      title: task.title,
      description: task.description,
      category: task.category,
      deadline: task.deadline,
      status: "PENDING",
      creditsOffered: parseInt(task.creditsOffered),
      postedById: user.id,
    };

    try {
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // send JWT token
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        alert("Task posted successfully!");
        navigate("/my-tasks");
      } else {
        const err = await response.json();
        alert("Failed to post task: " + (err.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Post a Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Credits Offered</label>
          <input
            type="number"
            className="form-control"
            name="creditsOffered"
            value={task.creditsOffered}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={task.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Deadline</label>
          <input
            type="date"
            className="form-control"
            name="deadline"
            value={task.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Post Task
        </button>
      </form>
    </div>
  );
}
