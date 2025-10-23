import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";

export default function TaskReviewSection({ task, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [task?.id]);

  const fetchComments = async () => {
    if (!task?.id) return;
    setFetchingComments(true);
    try {
      const res = await axios.get(`/api/tasks/review/${task.id}/comments`);
      // Ensure comments is always an array
      const data = Array.isArray(res.data) ? res.data : res.data.comments || [];
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setComments([]);
    } finally {
      setFetchingComments(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        `/api/tasks/review/${task.id}/comments`,
        { content: newComment, userId: currentUser.id },
        { headers: { "Content-Type": "application/json" } }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Failed to post comment: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/tasks/review/${task.id}/submit`);
      alert("Task submitted for review!");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/tasks/review/${task.id}/accept`);
      alert("Task accepted! Payment initiated 💸");
    } finally {
      setLoading(false);
    }
  };

  const handleRevision = async () => {
  if (!newComment.trim()) return alert("Add a revision note first!");
  setLoading(true);
  try {
    await axios.put(
      `/api/tasks/review/${task.id}/revision?ownerId=${currentUser.id}`, // ownerId as query param
      newComment, // send raw string
      { headers: { "Content-Type": "application/json" } }
    );
    alert("Revision requested!");
    setNewComment("");
    fetchComments(); // refresh comments
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="border p-3 rounded bg-light mt-3">
      <h5 className="mb-3">Task Review & Comments</h5>

      {/* Freelancer Actions */}
      {currentUser.id === task.assignedUser?.id && task.status === "IN_PROGRESS" && (
        <Button variant="primary" onClick={handleSubmitForReview} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Submit for Review"}
        </Button>
      )}

      {/* Owner Actions */}
      {currentUser.id === task.postedBy?.id && task.status === "PENDING_REVIEW" && (
        <div className="d-flex gap-2 mb-2">
          <Button variant="success" onClick={handleAccept} disabled={loading}>
            Accept Task
          </Button>
          <Button variant="warning" onClick={handleRevision} disabled={loading}>
            Request Revision
          </Button>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-3">
        <h6>Discussion Thread</h6>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            background: "#fff",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
        >
          {fetchingComments ? (
            <p>Loading comments...</p>
          ) : Array.isArray(comments) && comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="border-bottom py-1">
                <strong>{c.user?.username || "Unknown"}</strong>: {c.content}
                <div style={{ fontSize: "0.8rem", color: "gray" }}>
                  {c.timestamp ? new Date(c.timestamp).toLocaleString() : ""}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
        </div>

        <Form.Control
          as="textarea"
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment or feedback..."
          className="mt-2"
        />
        <Button variant="secondary" className="mt-2" onClick={handleComment} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Send Comment"}
        </Button>
      </div>
    </div>
  );
}
