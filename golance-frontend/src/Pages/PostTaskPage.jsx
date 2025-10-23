import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function PostTaskPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [creditsOffered, setCreditsOffered] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));

    const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!title || !description || !category || !creditsOffered || !deadline) {
    return setError("Please fill in all required fields.");
  }

  const payload = {
    title,
    description,
    category,
    creditsOffered: Number(creditsOffered),
    deadline,
    status: "OPEN", // ✅ always open
    postedById: user.id,
  };

  setLoading(true);
  try {
    await apiFetch("http://localhost:8080/api/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    alert("Task posted successfully!");
    navigate("/my-tasks"); // redirect to tasks page
  } catch (err) {
    setError(err.message);
  }
  setLoading(false);
};


  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card p-4 shadow rounded-4 bg-white">
            <h2 className="mb-4 text-center text-primary fw-bold">
              📝 Post a New Task
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <input
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Credits Offered</label>
                <input
                  type="number"
                  className="form-control"
                  value={creditsOffered}
                  onChange={(e) => setCreditsOffered(e.target.value)}
                  required
                  min={1}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Task"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
